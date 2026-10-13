const express = require('express');
const pool = require('../db');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

router.use(requireAdmin);

// GET /api/admin/stats — overview numbers for the dashboard
router.get('/stats', async (_req, res) => {
  try {
    const [
      totalUsers,
      newUsersToday,
      newUsersWeek,
      totalRequests,
      requestsToday,
      totalFailed,
      failedToday,
      wordsProcessed,
      activeToday,
      signupsByDay,
      requestsByDay,
    ] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS n FROM users'),
      pool.query("SELECT COUNT(*)::int AS n FROM users WHERE created_at >= NOW() - INTERVAL '1 day'"),
      pool.query("SELECT COUNT(*)::int AS n FROM users WHERE created_at >= NOW() - INTERVAL '7 days'"),
      pool.query("SELECT COUNT(*)::int AS n FROM activity_logs WHERE event_type = 'humanize'"),
      pool.query(
        "SELECT COUNT(*)::int AS n FROM activity_logs WHERE event_type = 'humanize' AND created_at >= NOW() - INTERVAL '1 day'"
      ),
      pool.query(
        "SELECT COUNT(*)::int AS n FROM activity_logs WHERE event_type = 'humanize' AND (metadata->>'success')::boolean = false"
      ),
      pool.query(
        "SELECT COUNT(*)::int AS n FROM activity_logs WHERE event_type = 'humanize' AND (metadata->>'success')::boolean = false AND created_at >= NOW() - INTERVAL '1 day'"
      ),
      pool.query(
        "SELECT COALESCE(SUM((metadata->>'word_count')::int), 0)::bigint AS n FROM activity_logs WHERE event_type = 'humanize' AND (metadata->>'success')::boolean = true"
      ),
      pool.query(
        "SELECT COUNT(DISTINCT user_id)::int AS n FROM activity_logs WHERE created_at >= NOW() - INTERVAL '1 day'"
      ),
      pool.query(`
        SELECT to_char(d.day, 'YYYY-MM-DD') AS date, COALESCE(COUNT(u.id), 0)::int AS count
        FROM generate_series(NOW() - INTERVAL '13 days', NOW(), INTERVAL '1 day') AS d(day)
        LEFT JOIN users u ON date_trunc('day', u.created_at) = date_trunc('day', d.day)
        GROUP BY d.day ORDER BY d.day
      `),
      pool.query(`
        SELECT to_char(d.day, 'YYYY-MM-DD') AS date, COALESCE(COUNT(a.id), 0)::int AS count
        FROM generate_series(NOW() - INTERVAL '13 days', NOW(), INTERVAL '1 day') AS d(day)
        LEFT JOIN activity_logs a ON a.event_type = 'humanize' AND date_trunc('day', a.created_at) = date_trunc('day', d.day)
        GROUP BY d.day ORDER BY d.day
      `),
    ]);

    const total = totalRequests.rows[0].n;
    const failed = totalFailed.rows[0].n;

    res.json({
      totalUsers: totalUsers.rows[0].n,
      newUsersToday: newUsersToday.rows[0].n,
      newUsersWeek: newUsersWeek.rows[0].n,
      totalRequests: total,
      requestsToday: requestsToday.rows[0].n,
      totalFailed: failed,
      failedToday: failedToday.rows[0].n,
      successRate: total ? Math.round(((total - failed) / total) * 100) : 100,
      wordsProcessed: Number(wordsProcessed.rows[0].n),
      activeToday: activeToday.rows[0].n,
      signupsByDay: signupsByDay.rows,
      requestsByDay: requestsByDay.rows,
    });
  } catch (err) {
    console.error('Admin stats error:', err.message);
    res.status(500).json({ error: 'Failed to load stats.' });
  }
});

// GET /api/admin/users?search=&page=&limit= — paginated user list
router.get('/users', async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 25, 1), 100);
  const offset = (page - 1) * limit;
  const search = (req.query.search || '').trim();

  try {
    const searchClause = search ? 'WHERE u.email ILIKE $1 OR u.name ILIKE $1' : '';
    const params = search ? [`%${search}%`] : [];

    const usersResult = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.created_at,
              (SELECT COUNT(*) FROM humanize_history WHERE user_id = u.id)::int AS request_count,
              (SELECT MAX(created_at) FROM activity_logs WHERE user_id = u.id) AS last_active
       FROM users u
       ${searchClause}
       ORDER BY u.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    const countResult = await pool.query(`SELECT COUNT(*)::int AS n FROM users u ${searchClause}`, params);

    res.json({
      users: usersResult.rows,
      total: countResult.rows[0].n,
      page,
      limit,
    });
  } catch (err) {
    console.error('Admin users list error:', err.message);
    res.status(500).json({ error: 'Failed to load users.' });
  }
});

// GET /api/admin/users/:id — a single user's profile, history, and activity
router.get('/users/:id', async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT id, name, email, role, google_id IS NOT NULL AS has_google, created_at FROM users WHERE id = $1',
      [req.params.id]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const [historyResult, activityResult] = await Promise.all([
      pool.query(
        'SELECT id, input_text, output_text, word_count, created_at FROM humanize_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
        [req.params.id]
      ),
      pool.query(
        'SELECT id, event_type, metadata, ip_address, created_at FROM activity_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100',
        [req.params.id]
      ),
    ]);

    res.json({
      user: userResult.rows[0],
      history: historyResult.rows,
      activity: activityResult.rows,
    });
  } catch (err) {
    console.error('Admin user detail error:', err.message);
    res.status(500).json({ error: 'Failed to load user.' });
  }
});

// GET /api/admin/activity?eventType=&page=&limit= — sitewide activity feed
router.get('/activity', async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 200);
  const offset = (page - 1) * limit;
  const eventType = (req.query.eventType || '').trim();

  try {
    const whereClause = eventType ? 'WHERE a.event_type = $1' : '';
    const params = eventType ? [eventType] : [];

    const activityResult = await pool.query(
      `SELECT a.id, a.event_type, a.metadata, a.ip_address, a.created_at,
              u.id AS user_id, u.name AS user_name, u.email AS user_email
       FROM activity_logs a
       LEFT JOIN users u ON a.user_id = u.id
       ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    const countResult = await pool.query(`SELECT COUNT(*)::int AS n FROM activity_logs a ${whereClause}`, params);

    res.json({
      activity: activityResult.rows,
      total: countResult.rows[0].n,
      page,
      limit,
    });
  } catch (err) {
    console.error('Admin activity feed error:', err.message);
    res.status(500).json({ error: 'Failed to load activity.' });
  }
});

// GET /api/admin/messages — contact form submissions, newest first
router.get('/messages', async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 25, 1), 100);
  try {
    const [rows, total] = await Promise.all([
      pool.query(
        'SELECT id, name, email, subject, message, created_at FROM contact_messages ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, (page - 1) * limit]
      ),
      pool.query('SELECT count(*)::int AS n FROM contact_messages'),
    ]);
    res.json({ messages: rows.rows, total: total.rows[0].n, page, limit });
  } catch (err) {
    console.error('Admin messages error:', err.message);
    res.status(500).json({ error: 'Failed to load messages.' });
  }
});

module.exports = router;
