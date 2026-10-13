const pool = require('./db');

/**
 * Fire-and-forget activity logger. Never throws — a logging failure
 * must never break the request it's attached to.
 */
function logActivity(userId, eventType, metadata = null, ipAddress = null) {
  pool
    .query(
      'INSERT INTO activity_logs (user_id, event_type, metadata, ip_address) VALUES ($1, $2, $3, $4)',
      [userId, eventType, metadata ? JSON.stringify(metadata) : null, ipAddress]
    )
    .catch((err) => console.error('Failed to log activity:', err.message));
}

module.exports = { logActivity };
