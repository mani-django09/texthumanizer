// A lightweight, self-contained "human score" estimator. It looks at the
// same statistical fingerprints real AI detectors rely on — sentence-length
// variance (burstiness), AI-signature phrases, and word repetition — and
// combines them into a 0-100 score. This is our own heuristic, not a call
// to GPTZero/Originality.ai/etc., so it costs nothing and returns instantly.

const AI_SIGNATURE_PHRASES = [
  'it is important to note',
  'it is worth noting',
  'in conclusion',
  'in summary',
  'furthermore',
  'moreover',
  'additionally',
  'delve into',
  'navigate the landscape',
  'in today\'s fast-paced world',
  'in the realm of',
  'plays a crucial role',
  'plays a vital role',
  'it is evident that',
  'on the other hand',
  'when it comes to',
  'a testament to',
  'unlock the potential',
  'unleash the power',
  'in the digital age',
];

function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function mean(nums) {
  return nums.reduce((a, b) => a + b, 0) / (nums.length || 1);
}

function stdDev(nums) {
  const m = mean(nums);
  return Math.sqrt(mean(nums.map((n) => (n - m) ** 2)));
}

/**
 * Returns { score, burstiness, signaturePhraseCount, repetitionRatio }.
 * score: 0 (reads very AI-like) to 100 (reads very human-like).
 */
function estimateHumanScore(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return { score: 0, burstiness: 0, signaturePhraseCount: 0, repetitionRatio: 0 };

  const sentences = splitSentences(trimmed);
  const lengths = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);

  // Burstiness: coefficient of variation of sentence length. AI text tends
  // toward uniform sentence length (low variance); human text varies more.
  const avgLen = mean(lengths);
  const burstiness = avgLen > 0 ? stdDev(lengths) / avgLen : 0;
  const burstinessScore = Math.min(burstiness / 0.45, 1) * 100; // 0.45 CoV ≈ strongly human-like

  // AI-signature phrases: each hit knocks points off — this is the most
  // reliable single signal, so it's weighted heaviest below.
  const lower = trimmed.toLowerCase();
  const signaturePhraseCount = AI_SIGNATURE_PHRASES.reduce(
    (count, phrase) => count + (lower.includes(phrase) ? 1 : 0),
    0
  );
  const phrasePenalty = Math.min(signaturePhraseCount * 22, 90);

  // Word repetition: AI text tends to reuse the same words more often
  // relative to text length (low lexical diversity).
  const words = lower.match(/[a-z']+/g) || [];
  const uniqueWords = new Set(words);
  const lexicalDiversity = words.length > 0 ? uniqueWords.size / words.length : 1;
  const repetitionRatio = 1 - lexicalDiversity;
  const diversityScore = lexicalDiversity * 100;

  const rawScore = burstinessScore * 0.3 + diversityScore * 0.3 + (100 - phrasePenalty) * 0.4;
  const score = Math.round(Math.max(0, Math.min(100, rawScore)));

  return {
    score,
    burstiness: Math.round(burstiness * 100) / 100,
    signaturePhraseCount,
    repetitionRatio: Math.round(repetitionRatio * 100) / 100,
  };
}

/**
 * Per-sentence breakdown for the AI Detector page: flags sentences that
 * contain a known AI-signature phrase. This is a coarse, explainable signal
 * (not a trained classifier) — it's meant to show *why* a sentence was
 * flagged, not to be exhaustive.
 */
function analyzeSentences(text) {
  const sentences = splitSentences(text);
  return sentences.map((sentence) => {
    const lower = sentence.toLowerCase();
    const matchedPhrase = AI_SIGNATURE_PHRASES.find((phrase) => lower.includes(phrase));
    return {
      sentence,
      flagged: Boolean(matchedPhrase),
      reason: matchedPhrase ? `Contains common AI phrasing: "${matchedPhrase}"` : null,
    };
  });
}

/**
 * Full AI-detection result: overall score plus a verdict band and the
 * per-sentence breakdown. score is 0 (reads very AI-like) to 100 (reads
 * very human-like) — same scale as estimateHumanScore.
 */
function detectAI(text) {
  const base = estimateHumanScore(text);
  const verdict = base.score >= 70 ? 'likely-human' : base.score >= 40 ? 'mixed' : 'likely-ai';
  return { ...base, verdict, sentences: analyzeSentences(text) };
}

module.exports = { estimateHumanScore, detectAI, splitSentences };
