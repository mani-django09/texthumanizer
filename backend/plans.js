// Single source of truth for what each plan allows. The pricing page copy must
// match these numbers — if you change one, change the other.
//
// wordsPerRequest / wordsPerMonth: null means "no limit".
// Lemon Squeezy variant ids map a purchased variant back to a plan; set them in
// .env once the products exist in the Lemon Squeezy dashboard.

const PLANS = {
  guest: {
    name: 'Guest',
    wordsPerRequest: 500,
    wordsPerMonth: 5000,
    rateLimitPer15Min: 20,
  },
  free: {
    name: 'Free account',
    wordsPerRequest: 500,
    wordsPerMonth: 5000,
    rateLimitPer15Min: 20,
  },
  basic: {
    name: 'Basic',
    wordsPerRequest: 2000,
    wordsPerMonth: 15000,
    rateLimitPer15Min: 40,
  },
  pro: {
    name: 'Pro',
    wordsPerRequest: null,
    wordsPerMonth: 50000,
    rateLimitPer15Min: 80,
  },
  unlimited: {
    name: 'Unlimited',
    wordsPerRequest: null,
    wordsPerMonth: null,
    rateLimitPer15Min: 150,
  },
};

// Statuses Lemon Squeezy reports that should still grant paid access.
// 'cancelled' stays entitled until ends_at passes — the user paid for the period.
const ENTITLED_STATUSES = new Set(['active', 'on_trial', 'cancelled']);

/** Maps a Lemon Squeezy variant id to one of our plan keys. */
function planForVariant(variantId) {
  const map = {
    [process.env.LS_VARIANT_BASIC_MONTHLY]:     'basic',
    [process.env.LS_VARIANT_BASIC_YEARLY]:      'basic',
    [process.env.LS_VARIANT_PRO_MONTHLY]:       'pro',
    [process.env.LS_VARIANT_PRO_YEARLY]:        'pro',
    [process.env.LS_VARIANT_UNLIMITED_MONTHLY]: 'unlimited',
    [process.env.LS_VARIANT_UNLIMITED_YEARLY]:  'unlimited',
  };
  return map[String(variantId)] || null;
}

/**
 * Decides the effective plan for a subscription row (or null for no row).
 * A cancelled subscription keeps its plan until ends_at has passed.
 */
function effectivePlan(subscription) {
  if (!subscription) return 'free';
  if (!ENTITLED_STATUSES.has(subscription.status)) return 'free';
  if (subscription.ends_at && new Date(subscription.ends_at) < new Date()) return 'free';
  return PLANS[subscription.plan] ? subscription.plan : 'free';
}

/** Current metering period, 'YYYY-MM' in UTC. */
function currentPeriod(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

module.exports = { PLANS, ENTITLED_STATUSES, planForVariant, effectivePlan, currentPeriod };
