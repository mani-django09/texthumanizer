require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const historyRoutes = require('./routes/history');
const adminRoutes = require('./routes/admin');
const referralRoutes = require('./routes/referral');
const affiliateRoutes = require('./routes/affiliate');
const { optionalAuth } = require('./middleware/auth');
const { logActivity } = require('./activityLogger');
const { estimateHumanScore, detectAI } = require('./humanScore');
const { checkPlagiarism, getSearchProvider } = require('./plagiarism');

const billingRoutes = require('./routes/billing');
const contactRoutes = require('./routes/contact');
const { getEntitlement, checkQuota, recordUsage } = require('./entitlements');

const app = express();
const PORT = process.env.PORT || 5000;

// Word limits now live in plans.js and are resolved per user by entitlements.js.

// Behind Nginx — trust the first proxy hop so rate-limit/IP logic sees the real client IP.
app.set('trust proxy', 1);

// ─── Middleware ───────────────────────────────────────────────────────────────
// The Lemon Squeezy webhook signature covers the exact bytes sent, so this route
// must see the raw body — it has to be mounted before the JSON parser.
app.use('/api/billing/webhook', express.raw({ type: '*/*', limit: '1mb' }));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// Separate limiters per concern — a busy admin polling dashboards, or a user
// retrying a mistyped password, should never compete with each other or with
// the (expensive, external-API-backed) humanize endpoint for the same budget.
const makeLimiter = (max, message) =>
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: message },
  });

const humanizeLimiter = makeLimiter(20, 'Too many requests. Please wait a few minutes and try again.');
const authLimiter = makeLimiter(30, 'Too many attempts. Please wait a few minutes and try again.');
const adminLimiter = makeLimiter(300, 'Too many requests. Please wait a few minutes and try again.');
// Plagiarism checks burn through a shared, small daily search-API quota — kept
// much stricter than the other limiters so one user can't exhaust it for everyone.
const plagiarismLimiter = makeLimiter(5, 'Plagiarism checks are limited to conserve our search quota. Please try again later.');

// ─── Auth, History & Admin Routes ─────────────────────────────────────────────
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/history', authLimiter, historyRoutes);
app.use('/api/admin', adminLimiter);
app.use('/api/admin', adminRoutes);
app.use('/api/referral', authLimiter, referralRoutes);
app.use('/api/affiliate', authLimiter, affiliateRoutes);
// Webhook is unauthenticated by design (verified by HMAC signature instead) and
// must not be rate limited, or Lemon Squeezy retries would be dropped.
app.use('/api/billing', billingRoutes);
// Tight limit: the contact form is unauthenticated and writes to the database.
app.use('/api/contact', makeLimiter(5, 'Too many messages. Please try again later or email us directly.'), contactRoutes);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const countWords = (text) =>
  text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

// ─── AI Providers ─────────────────────────────────────────────────────────────
// Tried in order. Each is OpenAI-chat-completions-compatible, so they share
// one request/response shape. A provider is skipped if its key isn't set.
const PROVIDERS = [
  {
    name: 'gemini',
    envKey: 'GEMINI_API_KEY',
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
  },
  {
    name: 'groq',
    envKey: 'GROQ_API_KEY',
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
  },
  {
    name: 'openai',
    envKey: 'OPENAI_API_KEY',
    url: 'https://api.openai.com/v1/chat/completions',
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  },
];

// ─── Rewrite Styles ───────────────────────────────────────────────────────────
const STYLES = {
  standard: 'natural and human-written, as if a skilled generalist writer wrote it',
  casual: 'casual and conversational — contractions, a relaxed tone, like texting a friend who writes well',
  professional: 'professional and polished — the tone of confident business writing, clear and credible but never stiff',
  academic: 'formal academic prose — precise vocabulary and structured argumentation, but still reading as genuinely human rather than robotic',
  creative: 'vivid and engaging — creative phrasing, some personality and flair, the kind of writing that holds attention',
};

function buildMessages(text, style) {
  const styleDescription = STYLES[style] || STYLES.standard;
  return [
    {
      role: 'system',
      content:
        `You are an expert human writer. Your job is to rewrite AI-generated text so it reads ${styleDescription}. Preserve all meaning, facts, and intent. Vary sentence length and structure, use natural transitions, avoid repetitive patterns, and remove any robotic or formulaic phrasing. ` +
        'Output ONLY the rewritten text and nothing else — no preamble, no explanations, no options, no labels like "Option 1", no markdown formatting, no quotation marks wrapping the output. Return a single final version, ready to use as-is.',
    },
    {
      role: 'user',
      content: `Rewrite the following text so it reads ${styleDescription}. Avoid robotic phrases and vary sentence structure. Keep the meaning the same. Respond with only the rewritten text — a single version, no alternatives, no formatting.\n\n${text}`,
    },
  ];
}

// ─── File upload (for text extraction) ────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

async function callProvider(provider, messages) {
  const response = await axios.post(
    provider.url,
    {
      model: provider.model,
      messages,
      max_tokens: 2048,
      temperature: 0.85,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env[provider.envKey]}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );
  return response.data.choices?.[0]?.message?.content?.trim();
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/humanize
 * Body: { text: string }
 * Returns: { humanizedText: string }
 * Limits come from the caller's plan (see plans.js); signed-in users'
 * requests are saved to their history.
 */
app.post('/api/humanize', humanizeLimiter, optionalAuth, async (req, res) => {
  const { text, style } = req.body;

  // Validate input
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'A "text" field is required.' });
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({ error: 'Please enter some text to humanize.' });
  }

  const wordCount = countWords(trimmed);
  const entitlement = await getEntitlement(req.user?.id, req.ip);
  const quota = checkQuota(entitlement, wordCount);
  if (!quota.allowed) {
    logActivity(
      req.user ? req.user.id : null,
      'humanize',
      { word_count: wordCount, guest: !req.user, success: false, reason: 'quota_exceeded', plan: entitlement.plan },
      req.ip
    );
    return res.status(400).json({ error: quota.error });
  }

  const configuredProviders = PROVIDERS.filter((p) => process.env[p.envKey]);
  if (configuredProviders.length === 0) {
    return res.status(500).json({ error: 'No AI provider configured on the server.' });
  }

  const selectedStyle = STYLES[style] ? style : 'standard';
  const messages = buildMessages(trimmed, selectedStyle);

  let lastErr = null;

  for (const provider of configuredProviders) {
    try {
      const humanizedText = await callProvider(provider, messages);
      if (humanizedText) {
        if (req.user) {
          pool
            .query(
              'INSERT INTO humanize_history (user_id, input_text, output_text, word_count) VALUES ($1, $2, $3, $4)',
              [req.user.id, trimmed, humanizedText, wordCount]
            )
            .catch((err) => console.error('Failed to save history:', err.message));
        }
        recordUsage(req.user?.id, wordCount, req.ip);
        logActivity(
          req.user ? req.user.id : null,
          'humanize',
          { word_count: wordCount, provider: provider.name, guest: !req.user, success: true, style: selectedStyle, plan: entitlement.plan },
          req.ip
        );
        const inputScore = estimateHumanScore(trimmed);
        const outputScore = estimateHumanScore(humanizedText);
        return res.json({ humanizedText, inputScore: inputScore.score, outputScore: outputScore.score });
      }
      console.error(`[${provider.name}] returned an empty response, trying next provider.`);
    } catch (err) {
      lastErr = err;
      const status = err.response?.status;
      const apiError = err.response?.data?.error || {};
      console.error(
        `[${provider.name}] API error [status=${status} code=${apiError.code || apiError.type}]:`,
        apiError.message || err.message
      );
      // Fall through to the next configured provider.
    }
  }

  // Every configured provider failed.
  const status = lastErr?.response?.status;
  const failureReason =
    status === 401
      ? 'auth_failed'
      : lastErr?.code === 'ECONNABORTED'
      ? 'timeout'
      : lastErr?.response?.data?.error?.code || lastErr?.message || 'unknown';

  logActivity(
    req.user ? req.user.id : null,
    'humanize',
    { word_count: wordCount, guest: !req.user, success: false, reason: failureReason },
    req.ip
  );

  if (status === 401) {
    return res.status(500).json({ error: 'API authentication failed. Please check the server configuration.' });
  }
  if (lastErr?.code === 'ECONNABORTED') {
    return res.status(504).json({ error: 'The request timed out. Please try again with shorter text.' });
  }
  return res.status(503).json({
    error: 'The humanizer is temporarily unavailable. Please try again in a moment.',
  });
});

/**
 * POST /api/grammar-check
 * Body: { text: string }
 * Fixes grammar, spelling, and punctuation only — does not rewrite style
 * or tone the way /api/humanize does.
 * Returns: { correctedText: string }
 */
app.post('/api/grammar-check', humanizeLimiter, optionalAuth, async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'A "text" field is required.' });
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({ error: 'Please enter some text to check.' });
  }

  const wordCount = countWords(trimmed);
  const entitlement = await getEntitlement(req.user?.id, req.ip);
  const quota = checkQuota(entitlement, wordCount);
  if (!quota.allowed) {
    return res.status(400).json({ error: quota.error });
  }

  const configuredProviders = PROVIDERS.filter((p) => process.env[p.envKey]);
  if (configuredProviders.length === 0) {
    return res.status(500).json({ error: 'No AI provider configured on the server.' });
  }

  const messages = [
    {
      role: 'system',
      content:
        'You are a meticulous proofreader. Fix only grammar, spelling, punctuation, and clear word-choice errors in the given text. Do NOT change the writing style, tone, vocabulary level, or sentence structure beyond what is needed to correct an actual error. Do NOT rewrite or rephrase correct sentences. Preserve the author\'s voice exactly. ' +
        'Output ONLY the corrected text — no preamble, no explanations, no list of changes, no markdown.',
    },
    {
      role: 'user',
      content: `Proofread and correct only genuine errors in the following text. Keep everything else — style, phrasing, structure — exactly as written.\n\n${trimmed}`,
    },
  ];

  for (const provider of configuredProviders) {
    try {
      const correctedText = await callProvider(provider, messages);
      if (correctedText) {
        logActivity(req.user ? req.user.id : null, 'grammar_check', { word_count: wordCount, guest: !req.user }, req.ip);
        return res.json({ correctedText });
      }
    } catch (err) {
      console.error(`[${provider.name}] grammar-check error:`, err.response?.data?.error?.message || err.message);
    }
  }

  return res.status(503).json({ error: 'Grammar check is temporarily unavailable. Please try again in a moment.' });
});

/**
 * POST /api/plagiarism-check
 * Body: { text: string }
 * Samples sentences from the text and checks each against the live web via
 * Google Custom Search (exact-phrase match). Free-tier search quota is
 * shared across the whole site, so only a handful of sentences are checked
 * per request and the endpoint is rate-limited more strictly than others.
 * Returns: { originalityScore, results, checkedCount, totalSentences }
 */
app.post('/api/plagiarism-check', plagiarismLimiter, optionalAuth, async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'A "text" field is required.' });
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({ error: 'Please enter some text to check.' });
  }

  const wordCount = countWords(trimmed);
  const entitlement = await getEntitlement(req.user?.id, req.ip);
  const quota = checkQuota(entitlement, wordCount);
  if (!quota.allowed) {
    return res.status(400).json({ error: quota.error });
  }

  const provider = getSearchProvider();
  if (!provider) {
    return res.status(503).json({ error: 'Plagiarism checking is not configured on the server yet.' });
  }

  try {
    const result = await checkPlagiarism(trimmed, provider);
    logActivity(
      req.user ? req.user.id : null,
      'plagiarism_check',
      { word_count: wordCount, guest: !req.user, originality_score: result.originalityScore },
      req.ip
    );
    return res.json(result);
  } catch (err) {
    console.error('Plagiarism check error:', err.message);
    return res.status(503).json({ error: 'Plagiarism check is temporarily unavailable. Please try again in a moment.' });
  }
});

/**
 * POST /api/ai-detect
 * Body: { text: string }
 * Runs our own statistical heuristic (burstiness, AI-signature phrases,
 * lexical diversity) — NOT a trained classifier or third-party detector API.
 * Returns: { score, verdict, burstiness, signaturePhraseCount, repetitionRatio, sentences }
 */
app.post('/api/ai-detect', humanizeLimiter, optionalAuth, async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'A "text" field is required.' });
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return res.status(400).json({ error: 'Please enter some text to analyze.' });
  }

  const wordCount = countWords(trimmed);
  const entitlement = await getEntitlement(req.user?.id, req.ip);
  const quota = checkQuota(entitlement, wordCount);
  if (!quota.allowed) {
    return res.status(400).json({ error: quota.error });
  }

  const result = detectAI(trimmed);
  logActivity(
    req.user ? req.user.id : null,
    'ai_detect',
    { word_count: wordCount, guest: !req.user, score: result.score, verdict: result.verdict },
    req.ip
  );
  return res.json(result);
});

/**
 * POST /api/extract-text
 * Multipart form upload, field name "file". Accepts .txt, .docx, .pdf.
 * Returns: { text: string }
 */
app.post('/api/extract-text', humanizeLimiter, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file was uploaded.' });
  }

  const { originalname, mimetype, buffer } = req.file;
  const lowerName = originalname.toLowerCase();

  try {
    let text;

    if (mimetype === 'text/plain' || lowerName.endsWith('.txt')) {
      text = buffer.toString('utf-8');
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      lowerName.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (mimetype === 'application/pdf' || lowerName.endsWith('.pdf')) {
      const result = await pdfParse(buffer);
      text = result.text;
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload a .txt, .docx, or .pdf file.' });
    }

    text = text.trim();
    if (!text) {
      return res.status(400).json({ error: 'No readable text was found in that file.' });
    }

    return res.json({ text });
  } catch (err) {
    console.error('File extraction error:', err.message);
    return res.status(500).json({ error: 'Failed to read that file. Please try a different one.' });
  }
});

/**
 * POST /api/humanize/regenerate-sentence
 * Body: { sentences: string[], index: number, style?: string }
 * Regenerates just one sentence in the context of the full passage.
 * Returns: { sentence: string }
 */
app.post('/api/humanize/regenerate-sentence', humanizeLimiter, optionalAuth, async (req, res) => {
  const { sentences, index, style } = req.body;

  if (!Array.isArray(sentences) || typeof index !== 'number' || !sentences[index]) {
    return res.status(400).json({ error: 'A sentence list and a valid index are required.' });
  }

  const configuredProviders = PROVIDERS.filter((p) => process.env[p.envKey]);
  if (configuredProviders.length === 0) {
    return res.status(500).json({ error: 'No AI provider configured on the server.' });
  }

  const selectedStyle = STYLES[style] ? style : 'standard';
  const styleDescription = STYLES[selectedStyle];
  const fullText = sentences.join(' ');
  const target = sentences[index];

  const messages = [
    {
      role: 'system',
      content:
        `You rewrite a single sentence within a larger passage so it reads ${styleDescription}, fits naturally with the sentences around it, and says something meaningfully different from the original phrasing while preserving its exact meaning. ` +
        'Output ONLY the replacement sentence — no quotes, no preamble, no explanation.',
    },
    {
      role: 'user',
      content: `Full passage for context:\n${fullText}\n\nRewrite only this sentence from the passage, keeping its meaning but changing the phrasing:\n"${target}"`,
    },
  ];

  for (const provider of configuredProviders) {
    try {
      const sentence = await callProvider(provider, messages);
      if (sentence) {
        return res.json({ sentence: sentence.replace(/^["']|["']$/g, '') });
      }
    } catch (err) {
      console.error(`[${provider.name}] regenerate-sentence error:`, err.response?.data?.error?.message || err.message);
    }
  }

  return res.status(503).json({ error: 'Could not regenerate that sentence right now. Please try again.' });
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large. Maximum size is 5MB.' : err.message;
    return res.status(400).json({ error: message });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ AI Humanizer backend running on http://localhost:${PORT}`);
});
