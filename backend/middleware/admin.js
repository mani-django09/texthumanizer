const pool = require('../db');
const { requireAuth } = require('./auth');

/**
 * Chains after requireAuth. Always re-checks the role against the database
 * rather than trusting the JWT, so a role change (or demotion) takes effect
 * immediately without waiting for the token to expire.
 */
async function requireAdmin(req, res, next) {
  requireAuth(req, res, async () => {
    try {
      const result = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
      if (result.rows[0]?.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required.' });
      }
      next();
    } catch (err) {
      console.error('Admin check error:', err.message);
      res.status(500).json({ error: 'Failed to verify admin access.' });
    }
  });
}

module.exports = { requireAdmin };
