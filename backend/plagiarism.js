const axios = require('axios');

const MAX_SENTENCES_CHECKED = 6; // keeps search quota sane
const MIN_WORDS_FOR_CHECK = 6; // skip trivial short sentences — too many false "no match" hits
const MIN_SHARED_RUN = 6; // consecutive words a result must share with the sentence to count as a match

function splitSentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Evenly samples up to `max` checkable sentences across the whole passage. */
function sampleSentences(sentences, max) {
  const checkable = sentences.filter((s) => s.split(/\s+/).length >= MIN_WORDS_FOR_CHECK);
  if (checkable.length <= max) return checkable;

  const step = checkable.length / max;
  const sampled = [];
  for (let i = 0; i < max; i++) {
    sampled.push(checkable[Math.floor(i * step)]);
  }
  return sampled;
}

const words = (s) =>
  s.toLowerCase().replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/[^a-z0-9\s']/g, ' ').split(/\s+/).filter(Boolean);

/**
 * True if `snippet` contains at least `run` consecutive words from `sentence`.
 * Search engines treat a quoted query as a strong hint, not a guarantee, so a
 * returned result is only reported as a match when its text really overlaps —
 * a wrong "this was copied" is worse than a missed one.
 */
function hasSharedRun(sentence, snippet, run = MIN_SHARED_RUN) {
  const a = words(sentence);
  const hay = ` ${words(snippet).join(' ')} `;
  const need = Math.min(run, a.length);
  for (let i = 0; i + need <= a.length; i++) {
    if (hay.includes(` ${a.slice(i, i + need).join(' ')} `)) return true;
  }
  return false;
}

/** Which search provider is configured, if any. */
function getSearchProvider() {
  if (process.env.SERPER_API_KEY) return { name: 'serper', key: process.env.SERPER_API_KEY };
  if (process.env.TAVILY_API_KEY) return { name: 'tavily', key: process.env.TAVILY_API_KEY };
  if (process.env.BRAVE_SEARCH_API_KEY) return { name: 'brave', key: process.env.BRAVE_SEARCH_API_KEY };
  // Google's Custom Search JSON API is closed to new customers and ends on 2027-01-01;
  // kept only for projects that already had access.
  if (process.env.GOOGLE_SEARCH_API_KEY && process.env.GOOGLE_SEARCH_ENGINE_ID) {
    return { name: 'google', key: process.env.GOOGLE_SEARCH_API_KEY, cx: process.env.GOOGLE_SEARCH_ENGINE_ID };
  }
  return null;
}

async function searchBrave(query, key) {
  const { data } = await axios.get('https://api.search.brave.com/res/v1/web/search', {
    params: { q: query, count: 5, extra_snippets: true },
    headers: { Accept: 'application/json', 'X-Subscription-Token': key },
    timeout: 10000,
  });
  return (data?.web?.results || []).map((r) => ({
    url: r.url,
    title: r.title,
    text: [r.title, r.description, ...(r.extra_snippets || [])].join(' '),
  }));
}

// Serper (Google results): 2,500 free queries on signup, no card.
async function searchSerper(query, key) {
  const { data } = await axios.post(
    'https://google.serper.dev/search',
    { q: query, num: 5 },
    { headers: { 'X-API-KEY': key, 'Content-Type': 'application/json' }, timeout: 15000 }
  );
  return (data?.organic || []).map((r) => ({ url: r.link, title: r.title, text: `${r.title} ${r.snippet || ''}` }));
}

// Tavily: 1,000 free credits a month, one credit per basic search.
async function searchTavily(query, key) {
  const { data } = await axios.post(
    'https://api.tavily.com/search',
    { query, search_depth: 'basic', max_results: 5 },
    { headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, timeout: 15000 }
  );
  return (data?.results || []).map((r) => ({ url: r.url, title: r.title, text: `${r.title} ${r.content || ''}` }));
}

async function searchGoogle(query, key, cx) {
  const { data } = await axios.get('https://www.googleapis.com/customsearch/v1', {
    params: { key, cx, q: query, num: 3 },
    timeout: 10000,
  });
  return (data.items || []).map((r) => ({ url: r.link, title: r.title, text: `${r.title} ${r.snippet || ''}` }));
}

/**
 * Searches the live web for one sentence as an exact phrase and returns the
 * first result whose text genuinely overlaps with it.
 */
async function checkSentence(sentence, provider) {
  const query = `"${sentence.replace(/"/g, '')}"`;
  try {
    const results =
      provider.name === 'serper' ? await searchSerper(query, provider.key)
      : provider.name === 'tavily' ? await searchTavily(query, provider.key)
      : provider.name === 'brave' ? await searchBrave(query, provider.key)
      : await searchGoogle(query, provider.key, provider.cx);
    const hit = results.find((r) => hasSharedRun(sentence, r.text));
    return hit ? { matched: true, source: hit.url, sourceTitle: hit.title } : { matched: false };
  } catch (err) {
    console.error(`Plagiarism search error [${provider.name}]:`, err.response?.status || '', err.response?.data?.error?.message || err.message);
    return { matched: false, error: true };
  }
}

/**
 * Runs a web-match scan across a sample of sentences from the text.
 * Returns { originalityScore, results, checkedCount, totalSentences }.
 * Throws if every search failed, so the caller reports an outage rather than
 * a misleading "100% original".
 */
async function checkPlagiarism(text, provider) {
  const allSentences = splitSentences(text);
  const sample = sampleSentences(allSentences, MAX_SENTENCES_CHECKED);

  const results = [];
  for (const sentence of sample) {
    const result = await checkSentence(sentence, provider);
    results.push({ sentence, ...result });
  }

  const validResults = results.filter((r) => !r.error);
  if (sample.length > 0 && validResults.length === 0) throw new Error('all searches failed');

  const matchedCount = validResults.filter((r) => r.matched).length;
  const originalityScore =
    validResults.length > 0 ? Math.round(((validResults.length - matchedCount) / validResults.length) * 100) : 100;

  return {
    originalityScore,
    results,
    checkedCount: sample.length,
    totalSentences: allSentences.length,
  };
}

module.exports = { checkPlagiarism, getSearchProvider, splitSentences, hasSharedRun };
