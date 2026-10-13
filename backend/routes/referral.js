const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/referral/me — the current user's referral code, link, and stats
router.get('/me', requireAuth, async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT referral_code, bonus_words FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const countResult = await pool.query('SELECT COUNT(*)::int AS n FROM users WHERE referred_by = $1', [
      req.user.id,
    ]);

    res.json({
      referralCode: user.referral_code,
      bonusWords: user.bonus_words,
      referralCount: countResult.rows[0].n,
      bonusPerReferral: 200,
      maxBonusWords: 1000,
    });
  } catch (err) {
    console.error('Referral info error:', err.message);
    res.status(500).json({ error: 'Failed to load referral info.' });
  }
});

module.exports = router;
