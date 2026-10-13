const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');
const { logActivity } = require('../activityLogger');
const { PLANS, planForVariant } = require('../plans');
const { getEntitlement } = require('../entitlements');

const router = express.Router();

const LS_API = 'https://api.lemonsqueezy.com/v1';

const VARIANTS = {
  basic:     { monthly: () => process.env.LS_VARIANT_BASIC_MONTHLY,     yearly: () => process.env.LS_VARIANT_BASIC_YEARLY },
  pro:       { monthly: () => process.env.LS_VARIANT_PRO_MONTHLY,       yearly: () => process.env.LS_VARIANT_PRO_YEARLY },
  unlimited: { monthly: () => process.env.LS_VARIANT_UNLIMITED_MONTHLY, yearly: () => process.env.LS_VARIANT_UNLIMITED_YEARLY },
};

/**
 * GET /api/billing/me
 * Current plan, usage against the monthly pool, and subscription details.
 */
router.get('/me', requireAuth, async (req, res) => {
  const ent = await getEntitlement(req.user.id);
  const allowance =
    ent.limits.wordsPerMonth === null ? null : ent.limits.wordsPerMonth + ent.bonusWords;

  return res.json({
    plan: ent.plan,
    planName: ent.limits.name,
    wordsPerRequest: ent.limits.wordsPerRequest,
    wordsPerMonth: allowance,
    wordsUsed: ent.wordsUsed,
    wordsRemaining: allowance === null ? null : Math.max(allowance - ent.wordsUsed, 0),
    bonusWords: ent.bonusWords,
    subscription: ent.subscription,
  });
});

/**
 * POST /api/billing/checkout
 * Body: { plan: 'basic'|'pro'|'unlimited', cycle: 'monthly'|'yearly' }
 * Creates a Lemon Squeezy checkout prefilled with the user's email and id so
 * the webhook can attribute the subscription back to this account.
 */
router.post('/checkout', requireAuth, async (req, res) => {
  const { plan, cycle } = req.body;

  if (!VARIANTS[plan] || !['monthly', 'yearly'].includes(cycle)) {
    return res.status(400).json({ error: 'Invalid plan or billing cycle.' });
  }

  const apiKey = process.env.LS_API_KEY;
  const storeId = process.env.LS_STORE_ID;
  const variantId = VARIANTS[plan][cycle]();

  if (!apiKey || !storeId || !variantId) {
    return res.status(503).json({ error: 'Billing is not configured on the server yet.' });
  }

  try {
    const { data } = await axios.post(
      `${LS_API}/checkouts`,
      {
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email: req.user.email,
              custom: { user_id: String(req.user.id) },
            },
            product_options: {
              redirect_url: `${process.env.FRONTEND_URL}/dashboard?upgraded=1`,
            },
          },
          relationships: {
            store:   { data: { type: 'stores',   id: String(storeId) } },
            variant: { data: { type: 'variants', id: String(variantId) } },
          },
        },
      },
      {
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 15000,
      }
    );

    const url = data?.data?.attributes?.url;
    if (!url) throw new Error('No checkout URL returned');

    logActivity(req.user.id, 'checkout_started', { plan, cycle }, req.ip);
    return res.json({ url });
  } catch (err) {
    console.error('Checkout creation failed:', err.response?.data || err.message);
    return res.status(502).json({ error: 'Could not start checkout. Please try again.' });
  }
});

/**
 * GET /api/billing/portal
 * Returns the Lemon Squeezy customer portal URL so users can update their card
 * or cancel without us handling any payment details.
 */
router.get('/portal', requireAuth, async (req, res) => {
  const apiKey = process.env.LS_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'Billing is not configured on the server yet.' });

  try {
    const { rows } = await pool.query(
      `SELECT ls_subscription_id FROM subscriptions
       WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`,
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'No subscription found.' });

    const { data } = await axios.get(`${LS_API}/subscriptions/${rows[0].ls_subscription_id}`, {
      headers: { Accept: 'application/vnd.api+json', Authorization: `Bearer ${apiKey}` },
      timeout: 15000,
    });

    const url = data?.data?.attributes?.urls?.customer_portal;
    if (!url) throw new Error('No portal URL returned');
    return res.json({ url });
  } catch (err) {
    console.error('Portal link failed:', err.response?.data || err.message);
    return res.status(502).json({ error: 'Could not open the billing portal. Please try again.' });
  }
});

/** Timing-safe HMAC-SHA256 check of the raw request body. */
function verifySignature(rawBody, signature, secret) {
  if (!rawBody || !signature || !secret) return false;
  const digest = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  const a = Buffer.from(digest, 'utf8');
  const b = Buffer.from(String(signature), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * POST /api/billing/webhook
 * Mounted with a raw body parser in server.js so the signature can be verified
 * against the exact bytes Lemon Squeezy signed.
 */
router.post('/webhook', async (req, res) => {
  const secret = process.env.LS_WEBHOOK_SECRET;
  if (!secret) return res.status(503).send('Webhook not configured');

  if (!verifySignature(req.body, req.get('X-Signature'), secret)) {
    console.error('Rejected webhook: bad signature');
    return res.status(401).send('Invalid signature');
  }

  let payload;
  try {
    payload = JSON.parse(req.body.toString('utf8'));
  } catch {
    return res.status(400).send('Malformed payload');
  }

  const eventName = payload?.meta?.event_name;
  const eventId = req.get('X-Event-Id') || `${eventName}:${payload?.data?.id}:${payload?.data?.attributes?.updated_at}`;

  // Acknowledge fast — Lemon Squeezy retries on non-2xx, and any error after
  // this point is ours to fix, not theirs to resend.
  res.status(200).send('OK');

  try {
    const dup = await pool.query(
      `INSERT INTO webhook_events (event_id, event_name) VALUES ($1, $2)
       ON CONFLICT (event_id) DO NOTHING RETURNING event_id`,
      [eventId, eventName]
    );
    if (dup.rowCount === 0) return; // already applied

    if (!eventName?.startsWith('subscription_')) return;

    const attrs = payload.data?.attributes || {};
    const userId = Number(payload.meta?.custom_data?.user_id);
    const plan = planForVariant(attrs.variant_id);

    if (!userId || !PLANS[plan]) {
      console.error('Webhook missing user_id or unknown variant:', {
        userId, variant: attrs.variant_id, eventName,
      });
      return;
    }

    await pool.query(
      `INSERT INTO subscriptions
         (user_id, ls_subscription_id, ls_customer_id, ls_variant_id, ls_order_id,
          plan, status, card_brand, card_last_four, renews_at, ends_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, now())
       ON CONFLICT (ls_subscription_id) DO UPDATE SET
         plan = EXCLUDED.plan,
         status = EXCLUDED.status,
         card_brand = EXCLUDED.card_brand,
         card_last_four = EXCLUDED.card_last_four,
         renews_at = EXCLUDED.renews_at,
         ends_at = EXCLUDED.ends_at,
         updated_at = now()`,
      [
        userId,
        String(payload.data.id),
        attrs.customer_id ? String(attrs.customer_id) : null,
        attrs.variant_id ? String(attrs.variant_id) : null,
        attrs.order_id ? String(attrs.order_id) : null,
        plan,
        attrs.status,
        attrs.card_brand || null,
        attrs.card_last_four || null,
        attrs.renews_at || null,
        attrs.ends_at || null,
      ]
    );

    logActivity(userId, 'subscription_updated', { event: eventName, plan, status: attrs.status }, null);
  } catch (err) {
    console.error('Webhook processing failed:', err.message);
  }
});

module.exports = router;
