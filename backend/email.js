const axios = require('axios');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || 'Text Humanizer <onboarding@resend.dev>';

/**
 * Sends a transactional email via Resend. If RESEND_API_KEY isn't configured,
 * logs the email to the console instead of failing — lets password reset
 * keep working in dev/local environments without an email provider set up.
 */
async function sendEmail({ to, subject, html }) {
  if (!RESEND_API_KEY) {
    console.log(`[email] RESEND_API_KEY not set — would have sent to ${to}: "${subject}"`);
    console.log(html);
    return;
  }

  await axios.post(
    'https://api.resend.com/emails',
    { from: FROM_EMAIL, to, subject, html },
    { headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' }, timeout: 10000 }
  );
}

module.exports = { sendEmail };
