-- Billing: Lemon Squeezy subscriptions, monthly usage metering, webhook idempotency.
-- Safe to re-run.

CREATE TABLE IF NOT EXISTS subscriptions (
  id                 SERIAL PRIMARY KEY,
  user_id            INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ls_subscription_id VARCHAR(64)  NOT NULL UNIQUE,
  ls_customer_id     VARCHAR(64),
  ls_variant_id      VARCHAR(64),
  ls_order_id        VARCHAR(64),
  plan               VARCHAR(20)  NOT NULL,   -- basic | pro | unlimited
  status             VARCHAR(30)  NOT NULL,   -- active | on_trial | past_due | cancelled | expired | paused | unpaid
  card_brand         VARCHAR(20),
  card_last_four     VARCHAR(4),
  renews_at          TIMESTAMPTZ,
  ends_at            TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user   ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- One row per user per calendar month. Incremented on every successful request
-- so the monthly word pool can be enforced without scanning activity_logs.
CREATE TABLE IF NOT EXISTS monthly_usage (
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period     CHAR(7) NOT NULL,                -- 'YYYY-MM' (UTC)
  words_used INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, period)
);

-- Lemon Squeezy can retry a webhook; keep delivered ids so we apply each once.
CREATE TABLE IF NOT EXISTS webhook_events (
  event_id    VARCHAR(128) PRIMARY KEY,
  event_name  VARCHAR(64),
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
