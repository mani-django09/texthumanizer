const crypto = require('crypto');
const pool = require('./db');
const { JWT_SECRET } = require('./middleware/auth');
const { PLANS, effectivePlan, currentPeriod } = require('./plans');

/** Salted hash so guest usage can be counted per visitor without storing raw IPs. */
function guestKey(ip) {
  return crypto.createHash('sha256').update(`${ip}:${JWT_SECRET}`).digest('hex');
}

/**
 * Resolves a visitor's current plan and this month's usage.
 * Signed-in users are looked up by id; guests by a hash of their IP.
 * Returns { plan, limits, wordsUsed, bonusWords, subscription }.
 * Never throws — on a DB error it falls back to zero usage so a metering
 * outage degrades limits rather than taking the whole tool down.
 */
async function getEntitlement(userId, ip) {
  const fallback = {
    plan: 'free', limits: PLANS.free, wordsUsed: 0, bonusWords: 0, subscription: null,
  };

  if (!userId) {
    const guest = { ...fallback, plan: 'guest', limits: PLANS.guest };
    if (!ip) return guest;
    try {
      const { rows } = await pool.query(
        'SELECT words_used FROM guest_monthly_usage WHERE ip_hash = $1 AND period = $2',
        [guestKey(ip), currentPeriod()]
      );
      return { ...guest, wordsUsed: Number(rows[0]?.words_used) || 0 };
    } catch (err) {
      console.error('guest usage lookup failed:', err.message);
      return guest;
    }
  }

  try {
    const { rows } = await pool.query(
      `SELECT
         u.bonus_words,
         s.plan, s.status, s.ends_at, s.renews_at,
         s.ls_subscription_id, s.card_brand, s.card_last_four,
         COALESCE(m.words_used, 0) AS words_used
       FROM users u
       LEFT JOIN LATERAL (
         SELECT * FROM subscriptions
         WHERE user_id = u.id
         ORDER BY (status IN ('active','on_trial')) DESC, updated_at DESC
         LIMIT 1
       ) s ON true
       LEFT JOIN monthly_usage m ON m.user_id = u.id AND m.period = $2
       WHERE u.id = $1`,
      [userId, currentPeriod()]
    );

    if (rows.length === 0) return fallback;
    const row = rows[0];
    const subscription = row.plan ? row : null;
    const plan = effectivePlan(subscription);

    return {
      plan,
      limits: PLANS[plan],
      wordsUsed: Number(row.words_used) || 0,
      bonusWords: row.bonus_words || 0,
      subscription: subscription
        ? {
            plan: subscription.plan,
            status: subscription.status,
            renewsAt: subscription.renews_at,
            endsAt: subscription.ends_at,
            cardBrand: subscription.card_brand,
            cardLastFour: subscription.card_last_four,
          }
        : null,
    };
  } catch (err) {
    console.error('getEntitlement failed:', err.message);
    return fallback;
  }
}

/**
 * Checks a request against the per-request and monthly limits.
 * Bonus words (from referrals) extend the monthly pool, not the per-request cap.
 * Returns { allowed: true } or { allowed: false, error }.
 */
function checkQuota(entitlement, wordCount) {
  const { limits, wordsUsed, bonusWords, plan } = entitlement;

  if (limits.wordsPerRequest !== null && wordCount > limits.wordsPerRequest) {
    return {
      allowed: false,
      error:
        plan === 'guest' || plan === 'free'
          ? `Word limit exceeded. The free limit is ${limits.wordsPerRequest} words per request; paid plans allow more. Your text has ${wordCount} words.`
          : `Word limit exceeded. Your ${limits.name} plan allows ${limits.wordsPerRequest} words per request. Your text has ${wordCount} words.`,
    };
  }

  if (limits.wordsPerMonth !== null) {
    const allowance = limits.wordsPerMonth + bonusWords;
    if (wordsUsed + wordCount > allowance) {
      const remaining = Math.max(allowance - wordsUsed, 0);
      return {
        allowed: false,
        error:
          plan === 'guest' || plan === 'free'
            ? `You've reached the free monthly allowance of ${allowance.toLocaleString()} words (${remaining.toLocaleString()} left). It resets on the 1st, or upgrade for a larger allowance.`
            : `Monthly limit reached. Your ${limits.name} plan includes ${allowance.toLocaleString()} words per month and you have ${remaining.toLocaleString()} left. Upgrade for a larger allowance.`,
      };
    }
  }

  return { allowed: true };
}

/**
 * Records words against the current month. Fire-and-forget: metering must never
 * fail a request the user already paid for in latency.
 */
function recordUsage(userId, wordCount, ip) {
  if (!wordCount) return;

  if (!userId) {
    if (!ip) return;
    pool
      .query(
        `INSERT INTO guest_monthly_usage (ip_hash, period, words_used)
         VALUES ($1, $2, $3)
         ON CONFLICT (ip_hash, period)
         DO UPDATE SET words_used = guest_monthly_usage.words_used + EXCLUDED.words_used,
                       updated_at = now()`,
        [guestKey(ip), currentPeriod(), wordCount]
      )
      .catch((err) => console.error('guest recordUsage failed:', err.message));
    return;
  }

  pool
    .query(
      `INSERT INTO monthly_usage (user_id, period, words_used)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, period)
       DO UPDATE SET words_used = monthly_usage.words_used + EXCLUDED.words_used,
                     updated_at = now()`,
      [userId, currentPeriod(), wordCount]
    )
    .catch((err) => console.error('recordUsage failed:', err.message));
}

module.exports = { getEntitlement, checkQuota, recordUsage };
