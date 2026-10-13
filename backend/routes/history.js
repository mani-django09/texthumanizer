const express = require('express');
const pool = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/history
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, input_text, output_text, word_count, created_at FROM humanize_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json({ history: result.rows });
  } catch (err) {
    console.error('History fetch error:', err.message);
    res.status(500).json({ error: 'Failed to load history.' });
  }
});

// GET /api/history/stats — usage dashboard: this-month totals + 30-day daily breakdown
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const [totals, monthTotals, dailyBreakdown] = await Promise.all([
      pool.query(
        'SELECT COUNT(*)::int AS requests, COALESCE(SUM(word_count), 0)::int AS words FROM humanize_history WHERE user_id = $1',
        [req.user.id]
      ),
      pool.query(
        `SELECT COUNT(*)::int AS requests, COALESCE(SUM(word_count), 0)::int AS words
         FROM humanize_history WHERE user_id = $1 AND created_at >= date_trunc('month', NOW())`,
        [req.user.id]
      ),
      pool.query(
        `SELECT to_char(d.day, 'YYYY-MM-DD') AS date, COALESCE(COUNT(h.id), 0)::int AS requests, COALESCE(SUM(h.word_count), 0)::int AS words
         FROM generate_series(NOW() - INTERVAL '29 days', NOW(), INTERVAL '1 day') AS d(day)
         LEFT JOIN humanize_history h ON h.user_id = $1 AND date_trunc('day', h.created_at) = date_trunc('day', d.day)
         GROUP BY d.day ORDER BY d.day`,
        [req.user.id]
      ),
    ]);

    res.json({
      totalRequests: totals.rows[0].requests,
      totalWords: totals.rows[0].words,
      requestsThisMonth: monthTotals.rows[0].requests,
      wordsThisMonth: monthTotals.rows[0].words,
      dailyBreakdown: dailyBreakdown.rows,
    });
  } catch (err) {
    console.error('History stats error:', err.message);
    res.status(500).json({ error: 'Failed to load usage stats.' });
  }
});

// DELETE /api/history/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM humanize_history WHERE id = $1 AND user_id = $2', [
      req.params.id,
      req.user.id,
    ]);
    res.json({ success: true });
  } catch (err) {
    console.error('History delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete entry.' });
  }
});

module.exports = router;
