const crypto = require('crypto');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const pool = require('../db');
const { JWT_SECRET, requireAuth, optionalAuth } = require('../middleware/auth');
const { logActivity } = require('../activityLogger');
const { getEntitlement } = require('../entitlements');
const { sendEmail } = require('../email');

const router = express.Router();
const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const REFERRAL_BONUS_WORDS = 200;
const MAX_BONUS_WORDS = 1000; // caps at 5 successful referrals

function issueToken(res, user) {
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: '30d',
  });
  res.cookie('token', token, COOKIE_OPTS);
}

function generateReferralCode() {
  return crypto.randomBytes(5).toString('hex').toUpperCase();
}

/** Links a new user to their referrer (if a valid code was given) and awards both sides a word bonus. */
async function applyReferral(newUserId, referralCode) {
  if (!referralCode) return;
  try {
    const referrer = await pool.query('SELECT id, bonus_words FROM users WHERE referral_code = $1', [
      referralCode.toUpperCase(),
    ]);
    if (referrer.rows.length === 0 || referrer.rows[0].id === newUserId) return;

    const referrerId = referrer.rows[0].id;
    await pool.query('UPDATE users SET referred_by = $1 WHERE id = $2', [referrerId, newUserId]);
    await pool.query(
      'UPDATE users SET bonus_words = LEAST(bonus_words + $1, $2) WHERE id = $3',
      [REFERRAL_BONUS_WORDS, MAX_BONUS_WORDS, referrerId]
    );
    await pool.query(
      'UPDATE users SET bonus_words = LEAST(bonus_words + $1, $2) WHERE id = $3',
      [REFERRAL_BONUS_WORDS, MAX_BONUS_WORDS, newUserId]
    );
    logActivity(referrerId, 'referral_bonus_earned', { referred_user_id: newUserId }, null);
  } catch (err) {
    console.error('Failed to apply referral:', err.message);
  }
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { email, password, name, referralCode } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name, referral_code) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [email.toLowerCase(), passwordHash, name.trim(), generateReferralCode()]
    );
    const user = result.rows[0];
    issueToken(res, user);
    logActivity(user.id, 'signup', { method: 'email' }, req.ip);
    await applyReferral(user.id, referralCode);
    return res.status(201).json({ user });
  } catch (err) {
    console.error('Signup error:', err.message);
    return res.status(500).json({ error: 'Failed to create account. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];
    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    issueToken(res, user);
    logActivity(user.id, 'login', { method: 'email' }, req.ip);
    return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: 'Failed to log in. Please try again.' });
  }
});

// POST /api/auth/google — body: { credential, referralCode? } (Google Identity Services ID token)
router.post('/google', async (req, res) => {
  const { credential, referralCode } = req.body;

  if (!credential) {
    return res.status(400).json({ error: 'Missing Google credential.' });
  }
  if (!googleClient) {
    return res.status(500).json({ error: 'Google sign-in is not configured on the server.' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email.toLowerCase();
    const name = payload.name || email.split('@')[0];

    const result = await pool.query('SELECT * FROM users WHERE google_id = $1 OR email = $2', [
      googleId,
      email,
    ]);
    let user = result.rows[0];

    let isNewUser = false;
    if (!user) {
      const inserted = await pool.query(
        'INSERT INTO users (email, google_id, name, referral_code) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
        [email, googleId, name, generateReferralCode()]
      );
      user = inserted.rows[0];
      isNewUser = true;
    } else if (!user.google_id) {
      await pool.query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, user.id]);
    }

    issueToken(res, user);
    logActivity(user.id, isNewUser ? 'signup' : 'login', { method: 'google' }, req.ip);
    if (isNewUser) await applyReferral(user.id, referralCode);
    return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error('Google auth error:', err.message);
    return res.status(401).json({ error: 'Google sign-in failed. Please try again.' });
  }
});

// GET /api/auth/me
// Signed-out visitors get 200 with user: null (not 401) so every guest page view
// doesn't log a failed request in the browser console.
router.get('/me', optionalAuth, async (req, res) => {
  if (!req.user) return res.json({ user: null });
  try {
    const result = await pool.query('SELECT role, bonus_words FROM users WHERE id = $1', [req.user.id]);
    const role = result.rows[0]?.role || 'user';
    const bonusWords = result.rows[0]?.bonus_words || 0;
    // wordsPerRequest: number, or null for plans with no per-request cap.
    const { plan, limits } = await getEntitlement(req.user.id);
    res.json({ user: { ...req.user, role, bonusWords, plan, wordsPerRequest: limits.wordsPerRequest } });
  } catch (err) {
    console.error('Me endpoint error:', err.message);
    res.json({ user: req.user });
  }
});

// POST /api/auth/logout
router.post('/logout', optionalAuth, (req, res) => {
  if (req.user) logActivity(req.user.id, 'logout', null, req.ip);
  const { maxAge, ...clearOpts } = COOKIE_OPTS; // Express 5 rejects maxAge on clearCookie
  res.clearCookie('token', clearOpts);
  res.json({ success: true });
});

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// POST /api/auth/forgot-password — body: { email }
// Always responds the same way regardless of whether the email exists,
// so this endpoint can't be used to enumerate registered accounts.
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const genericResponse = {
    message: 'If an account with that email exists, a password reset link has been sent.',
  };

  if (!email || !isValidEmail(email)) {
    return res.json(genericResponse);
  }

  try {
    const result = await pool.query(
      'SELECT id, name, password_hash FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    const user = result.rows[0];

    // Only email/password accounts have anything to reset.
    if (user && user.password_hash) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
      await pool.query(
        'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
        [user.id, hashToken(token), expiresAt]
      );

      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
      sendEmail({
        to: email,
        subject: 'Reset your Text Humanizer password',
        html: `
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your Text Humanizer password. This link expires in 30 minutes:</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      }).catch((err) => console.error('Failed to send password reset email:', err.message));

      logActivity(user.id, 'password_reset_requested', null, req.ip);
    }

    return res.json(genericResponse);
  } catch (err) {
    console.error('Forgot-password error:', err.message);
    return res.json(genericResponse);
  }
});

// POST /api/auth/reset-password — body: { token, password }
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: 'Token and new password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const tokenHash = hashToken(token);
    const result = await pool.query(
      'SELECT id, user_id FROM password_reset_tokens WHERE token_hash = $1 AND used = false AND expires_at > NOW()',
      [tokenHash]
    );
    const resetRecord = result.rows[0];

    if (!resetRecord) {
      return res.status(400).json({ error: 'This reset link is invalid or has expired. Please request a new one.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, resetRecord.user_id]);
    await pool.query('UPDATE password_reset_tokens SET used = true WHERE id = $1', [resetRecord.id]);

    logActivity(resetRecord.user_id, 'password_reset_completed', null, req.ip);
    return res.json({ success: true });
  } catch (err) {
    console.error('Reset-password error:', err.message);
    return res.status(500).json({ error: 'Failed to reset password. Please try again.' });
  }
});

module.exports = router;
