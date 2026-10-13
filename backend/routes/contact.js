const express = require('express');
const pool = require('../db');
const { sendEmail } = require('../email');

const router = express.Router();

const SUBJECTS = new Set(['general', 'bug', 'feature', 'billing', 'other']);
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/**
 * POST /api/contact
 * Body: { name, email, subject, message }
 * Stores the message (readable in the admin panel) and, when CONTACT_TO and an
 * email provider are configured, forwards a copy by email.
 */
router.post('/', async (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim();
  const subject = String(req.body?.subject || '').trim();
  const message = String(req.body?.message || '').trim();

  if (!name || name.length > 120) return res.status(400).json({ error: 'Please enter your name.' });
  if (!isValidEmail(email) || email.length > 255) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (!SUBJECTS.has(subject)) return res.status(400).json({ error: 'Please choose a subject.' });
  if (message.length < 10) return res.status(400).json({ error: 'Please write a message of at least 10 characters.' });
  if (message.length > 5000) return res.status(400).json({ error: 'Please keep your message under 5,000 characters.' });

  try {
    await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message, ip_address) VALUES ($1, $2, $3, $4, $5)',
      [name, email, subject, message, req.ip]
    );
  } catch (err) {
    console.error('Contact message save failed:', err.message);
    return res.status(500).json({ error: 'We could not send your message. Please email us directly instead.' });
  }

  // The message is already saved, so a failed notification must not fail the request.
  if (process.env.CONTACT_TO) {
    sendEmail({
      to: process.env.CONTACT_TO,
      subject: `[Contact · ${subject}] ${name}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }).catch((err) => console.error('Contact notification email failed:', err.message));
  }

  return res.json({ success: true });
});

module.exports = router;
