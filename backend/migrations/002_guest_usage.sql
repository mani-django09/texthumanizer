-- Monthly word metering for visitors without an account. Keyed by a salted hash of
-- the client IP (never the raw address). Safe to re-run.

CREATE TABLE IF NOT EXISTS guest_monthly_usage (
  ip_hash    CHAR(64) NOT NULL,
  period     CHAR(7)  NOT NULL,             -- 'YYYY-MM' (UTC)
  words_used INTEGER  NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (ip_hash, period)
);
