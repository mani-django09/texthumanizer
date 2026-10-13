const crypto = require('crypto');
const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const generateAffiliateCode = () => crypto.randomBytes(5).toString('hex').toUpperCase();

// GET /api/affiliate/me — the current user's affiliate application status, if any
router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, website, audience_description, status, affiliate_code, created_at FROM affiliate_applications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );
    res.json({ application: result.rows[0] || null });
  } catch (err) {
    console.error('Affiliate status error:', err.message);
    res.status(500).json({ error: 'Failed to load affiliate status.' });
  }
});

// POST /api/affiliate/apply — body: { website, audienceDescription }
router.post('/apply', requireAuth, async (req, res) => {
  const { website, audienceDescription } = req.body;

  if (!audienceDescription || audienceDescription.trim().length < 20) {
    return res.status(400).json({
      error: 'Please tell us a bit more about your audience (at least 20 characters).',
    });
  }

  try {
    const existing = await pool.query(
      "SELECT id FROM affiliate_applications WHERE user_id = $1 AND status IN ('pending', 'approved')",
      [req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'You already have an application on file.' });
    }

    const result = await pool.query(
      'INSERT INTO affiliate_applications (user_id, website, audience_description, affiliate_code) VALUES ($1, $2, $3, $4) RETURNING id, status, affiliate_code, created_at',
      [req.user.id, website || null, audienceDescription.trim(), generateAffiliateCode()]
    );

    res.status(201).json({ application: result.rows[0] });
  } catch (err) {
    console.error('Affiliate application error:', err.message);
    res.status(500).json({ error: 'Failed to submit application. Please try again.' });
  }
});

module.exports = router;
