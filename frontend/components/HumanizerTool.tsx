'use client';

import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { diffWords } from 'diff';
import { useAuth } from './AuthContext';
import { withRedirectParam } from '@/lib/site';
import { wordLimitFor } from '@/lib/limits';

const API_URL   = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const STYLE_KEY = 'th_style';

const SAMPLES = [
  'It is important to note that artificial intelligence has revolutionized numerous industries. ' +
  'Furthermore, the advent of large language models has enabled unprecedented capabilities in natural language processing. ' +
  'In conclusion, it is evident that AI will continue to delve into new domains and reshape the future of work.',

  'In today\'s fast-paced world, effective time management plays a crucial role in achieving success. ' +
  'Additionally, it is worth noting that prioritizing tasks allows individuals to navigate the landscape of modern work. ' +
  'Moreover, it is evident that consistent habits are a testament to long-term productivity.',

  'When it comes to remote work, it is important to note that communication is key. ' +
  'On the other hand, teams that unlock the potential of asynchronous tools often see better results. ' +
  'In summary, remote collaboration plays a vital role in the modern workplace.',
];

/* Icons are heroicons (outline) paths. */
const STYLES = [
  {
    id: 'standard', label: 'Standard', blurb: 'Balanced, natural rewrite',
    grad: 'from-blue-500 to-indigo-600', ring: 'ring-blue-500/50',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  },
  {
    id: 'casual', label: 'Casual', blurb: 'Relaxed and conversational',
    grad: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-500/50',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  },
  {
    id: 'professional', label: 'Professional', blurb: 'Polished and business-ready',
    grad: 'from-slate-600 to-slate-800', ring: 'ring-slate-500/50',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    id: 'academic', label: 'Academic', blurb: 'Formal, precise, scholarly',
    grad: 'from-violet-500 to-purple-700', ring: 'ring-violet-500/50',
    icon: 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222',
  },
  {
    id: 'creative', label: 'Creative', blurb: 'Vivid, expressive phrasing',
    grad: 'from-rose-500 to-orange-500', ring: 'ring-rose-500/50',
    icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
  },
];

/* Stock phrases that make text read as machine-written. Matches the server heuristic's list. */
const AI_TELLS = [
  'it is important to note', 'it is worth noting', 'in conclusion', 'in summary', 'furthermore',
  'moreover', 'additionally', 'delve into', 'navigate the landscape', "in today's fast-paced world",
  'in the realm of', 'plays a crucial role', 'plays a vital role', 'it is evident that',
  'on the other hand', 'when it comes to', 'a testament to', 'unlock the potential',
  'unleash the power', 'in the digital age',
];

const LOADING_STEPS = ['Reading your text', 'Rewriting rhythm & phrasing', 'Polishing the result'];

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function detectTells(text: string): string[] {
  const lower = text.toLowerCase().replace(/[’‘]/g, "'");
  return AI_TELLS.filter((p) => lower.includes(p));
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
    </svg>
  );
}

/* Static lookup — Tailwind purges class names built at runtime. */
const SCORE_STYLES = {
  high: { stroke: 'stroke-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  mid:  { stroke: 'stroke-amber-500',   text: 'text-amber-600 dark:text-amber-400' },
  low:  { stroke: 'stroke-red-500',     text: 'text-red-600 dark:text-red-400' },
} as const;

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) { setValue(target); return; }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function ScoreGauge({ label, score }: { label: string; score: number }) {
  const tier = score >= 70 ? 'high' : score >= 40 ? 'mid' : 'low';
  const s = SCORE_STYLES[tier];
  const shown = useCountUp(score);
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setArmed(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  const r = 36;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 88 88" className="w-24 h-24 -rotate-90" aria-hidden>
          <circle cx="44" cy="44" r={r} fill="none" strokeWidth="8" className="stroke-slate-200 dark:stroke-slate-700" />
          <circle
            cx="44" cy="44" r={r} fill="none" strokeWidth="8" strokeLinecap="round"
            className={`${s.stroke} transition-[stroke-dashoffset] duration-[1200ms] ease-out`}
            strokeDasharray={c}
            strokeDashoffset={armed ? c - (score / 100) * c : c}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-black tabular-nums ${s.text}`}>{shown}</span>
        </div>
      </div>
      <span className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}

function WordRing({ pct, tone }: { pct: number; tone: 'ok' | 'warn' | 'over' }) {
  const r = 10;
  const c = 2 * Math.PI * r;
  const stroke = tone === 'over' ? 'stroke-red-500' : tone === 'warn' ? 'stroke-amber-500' : 'stroke-blue-500';
  return (
    <svg viewBox="0 0 28 28" className="w-7 h-7 -rotate-90" aria-hidden>
      <circle cx="14" cy="14" r={r} fill="none" strokeWidth="3" className="stroke-slate-200 dark:stroke-slate-700" />
      <circle
        cx="14" cy="14" r={r} fill="none" strokeWidth="3" strokeLinecap="round"
        className={`${stroke} transition-all duration-500`}
        strokeDasharray={c} strokeDashoffset={c - (Math.min(pct, 100) / 100) * c}
      />
    </svg>
  );
}

export default function HumanizerTool() {
  const { user } = useAuth();
  const pathname = usePathname();
  const signupHref = withRedirectParam('/signup', pathname);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef  = useRef<HTMLTextAreaElement>(null);

  const [inputText,  setInputText]  = useState('');
  const [outputText, setOutputText] = useState('');
  const [style, setStyle] = useState('standard');
  const [isLoading,  setIsLoading]  = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error,      setError]      = useState('');
  const [copied,     setCopied]     = useState(false);
  const [inputScore, setInputScore] = useState<number | null>(null);
  const [outputScore, setOutputScore] = useState<number | null>(null);
  const [view, setView] = useState<'clean' | 'changes'>('clean');
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [sampleIndex, setSampleIndex] = useState(0);

  const { max: MAX_WORDS, unlimited } = wordLimitFor(user);
  const wordCount       = countWords(inputText);
  const outputWordCount = countWords(outputText);
  const isOverLimit     = wordCount > MAX_WORDS;
  const pct             = Math.min((wordCount / MAX_WORDS) * 100, 100);
  const limitTone       = isOverLimit ? 'over' : wordCount > MAX_WORDS * 0.8 ? 'warn' : 'ok';
  const outputSentences = useMemo(() => (outputText ? splitSentences(outputText) : []), [outputText]);
  const tells           = useMemo(() => detectTells(inputText), [inputText]);
  const sentenceCount   = useMemo(() => (inputText.trim() ? splitSentences(inputText).length : 0), [inputText]);
  const readMinutes     = Math.max(1, Math.ceil(wordCount / 200));
  const isRevealing     = revealed !== null;
  const activeStyle     = STYLES.find((s) => s.id === style) || STYLES[0];

  const diffParts = useMemo(
    () => (outputText && inputText ? diffWords(inputText, outputText) : null),
    [inputText, outputText]
  );

  const rewordedPct = useMemo(() => {
    if (!diffParts) return null;
    let added = 0;
    let kept = 0;
    for (const part of diffParts) {
      if (part.added) added += countWords(part.value);
      else if (!part.removed) kept += countWords(part.value);
    }
    return added + kept === 0 ? null : Math.round((added / (added + kept)) * 100);
  }, [diffParts]);

  /* Remember the last-used style. */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STYLE_KEY);
      if (saved && STYLES.some((s) => s.id === saved)) setStyle(saved);
    } catch { /* storage unavailable — default style is fine */ }
  }, []);

  const chooseStyle = useCallback((id: string) => {
    setStyle(id);
    try { localStorage.setItem(STYLE_KEY, id); } catch { /* ignore */ }
  }, []);

  /* Drop the sentence selection whenever the result is cleared or replaced. */
  useEffect(() => {
    if (!outputText) setSelectedIndex(null);
  }, [outputText]);

  /* Elapsed timer drives the loading steps. */
  useEffect(() => {
    if (!isLoading) return;
    setElapsed(0);
    const t = setInterval(() => setElapsed((e) => e + 0.25), 250);
    return () => clearInterval(t);
  }, [isLoading]);

  /* Typewriter reveal of a fresh result. Driven by elapsed time (not ticks), so a
     backgrounded tab — where timers and frames are throttled — catches up instantly. */
  useEffect(() => {
    if (!isRevealing || !outputText) return;
    const len = outputText.length;
    const duration = Math.min(3000, Math.max(900, len * 12));
    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const n = Math.floor(len * Math.min((now - start) / duration, 1));
      if (n >= len) { setRevealed(null); return; }
      setRevealed(n);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [isRevealing, outputText]);

  /* ── API call ── */
  const handleHumanize = useCallback(async () => {
    if (!inputText.trim()) { setError('Please enter some text to humanize.'); return; }
    if (isOverLimit)       { setError(`Word limit exceeded. Please reduce to ${MAX_WORDS} words.`); return; }

    setIsLoading(true); setError(''); setOutputText(''); setView('clean'); setRevealed(null);
    setInputScore(null); setOutputScore(null);
    try {
      const res  = await fetch(`${API_URL}/api/humanize`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: inputText, style }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Humanization failed. Please try again.');
      setOutputText(data.humanizedText);
      setRevealed(prefersReducedMotion() ? null : 0);
      if (typeof data.inputScore === 'number') setInputScore(data.inputScore);
      if (typeof data.outputScore === 'number') setOutputScore(data.outputScore);
    } catch (err) {
      setError(
        err instanceof TypeError && String(err).includes('fetch')
          ? 'Cannot connect to the server. Please check your connection and try again.'
          : err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isOverLimit, MAX_WORDS, style]);

  /* ── File upload ── */
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsUploading(true); setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/api/extract-text`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to read that file.');
      setInputText(data.text);
      setOutputText(''); setInputScore(null); setOutputScore(null); setRevealed(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read that file.');
    } finally {
      setIsUploading(false);
    }
  }, []);

  /* ── Paste from clipboard ── */
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) { setError('Your clipboard is empty.'); return; }
      setInputText(text); setOutputText(''); setInputScore(null); setOutputScore(null); setRevealed(null); setError('');
    } catch {
      setError('Clipboard access was blocked — paste with Ctrl/⌘ + V instead.');
      textareaRef.current?.focus();
    }
  }, []);

  /* ── Regenerate a single sentence ── */
  const handleRegenerateSentence = useCallback(async (index: number) => {
    setRegeneratingIndex(index);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/humanize/regenerate-sentence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ sentences: outputSentences, index, style }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not regenerate that sentence.');
      const updated = [...outputSentences];
      updated[index] = data.sentence;
      setOutputText(updated.join(' '));
      setSelectedIndex(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not regenerate that sentence.');
    } finally {
      setRegeneratingIndex(null);
    }
  }, [outputSentences, style]);

  /* ── Copy ── */
  const handleCopy = useCallback(async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setError('Clipboard access denied. Please copy the text manually.');
    }
  }, [outputText]);

  /* ── Download ── */
  const handleDownload = useCallback(() => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'humanized-text.txt';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }, [outputText]);

  /* ── Run the output through again ── */
  const handleUseAsInput = useCallback(() => {
    if (!outputText) return;
    setInputText(outputText);
    setOutputText(''); setInputScore(null); setOutputScore(null); setView('clean'); setRevealed(null);
    textareaRef.current?.focus();
  }, [outputText]);

  const handleClear = useCallback(() => {
    setInputText(''); setOutputText(''); setError('');
    setInputScore(null); setOutputScore(null); setView('clean'); setRevealed(null);
  }, []);

  const handleSample = useCallback(() => {
    setInputText(SAMPLES[sampleIndex % SAMPLES.length]);
    setSampleIndex((i) => i + 1);
    setOutputText(''); setInputScore(null); setOutputScore(null); setRevealed(null); setError('');
  }, [sampleIndex]);

  /* ── Keyboard shortcut: ⌘/Ctrl + Enter ── */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleHumanize();
    }
  }, [handleHumanize]);

  const stepIndex = Math.min(LOADING_STEPS.length - 1, Math.floor(elapsed / 4));
  const scoreDelta = inputScore !== null && outputScore !== null ? outputScore - inputScore : 0;
  const resultReady = !!outputText && !isLoading && !isRevealing;

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute -inset-x-4 -inset-y-6 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-cyan-500/10 blur-3xl rounded-[3rem] pointer-events-none" aria-hidden />

        <div className="glow-ring">
          <div className="glass-card !rounded-3xl p-4 sm:p-6">

            {/* ═════════ Style selector ═════════ */}
            <div className="flex items-center justify-between gap-3 mb-2.5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex-shrink-0">Style</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate" aria-live="polite">{activeStyle.blurb}</p>
            </div>
            <div
              role="radiogroup"
              aria-label="Rewrite style"
              className="flex gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible pb-1 -mx-1 px-1 mb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {STYLES.map((s) => {
                const active = style === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => chooseStyle(s.id)}
                    className={`flex-shrink-0 inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full border text-sm font-semibold transition-all duration-200 ${
                      active
                        ? `bg-white dark:bg-slate-900 border-transparent shadow-card ring-2 ${s.ring} text-slate-900 dark:text-white`
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full bg-gradient-to-br ${s.grad} text-white flex items-center justify-center transition-transform duration-200 ${active ? 'scale-110' : ''}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                      </svg>
                    </span>
                    {s.label}
                  </button>
                );
              })}
            </div>

            {/* ═════════ Panels ═════════ */}
            <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-5">

              <div className="hidden xl:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white items-center justify-center shadow-glow-sm ring-4 ring-white/70 dark:ring-slate-900/70 pointer-events-none" aria-hidden>
                {isLoading ? <Spinner className="w-5 h-5" /> : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                )}
              </div>

              {/* ───────── INPUT ───────── */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/40 overflow-hidden flex flex-col">
                <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-glow-xs">
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-white">Your AI text</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Paste, type or upload a file</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".txt,.docx,.pdf,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={handlePaste}
                      title="Paste from clipboard"
                      className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                      <span className="hidden sm:inline">Paste</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      title="Upload a .txt, .docx, or .pdf file"
                      className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all disabled:opacity-40"
                    >
                      {isUploading ? <Spinner className="w-3.5 h-3.5" /> : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      )}
                      <span className="hidden sm:inline">{isUploading ? 'Reading…' : 'Upload'}</span>
                    </button>
                    {inputText && (
                      <button type="button" onClick={handleClear} title="Clear all"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 p-4 sm:p-5">
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={'Paste your AI-generated text here…\n\nWorks with ChatGPT, Claude, Gemini, Copilot, Jasper and any other AI tool.'}
                      className="textarea-base h-72 !bg-white dark:!bg-slate-900/70"
                      aria-label="Input AI-generated text"
                    />
                    {!inputText && (
                      <button
                        type="button"
                        onClick={handleSample}
                        className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Try a sample
                      </button>
                    )}
                  </div>

                  {/* Live stats */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="flex items-center gap-2">
                      <WordRing pct={pct} tone={limitTone} />
                      <span className={`text-xs font-bold tabular-nums ${
                        isOverLimit ? 'text-red-600 dark:text-red-400' : limitTone === 'warn' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-600 dark:text-slate-300'
                      }`}>
                        {wordCount.toLocaleString()} <span className="font-medium text-slate-400 dark:text-slate-500">{unlimited ? "words · no cap" : `/ ${MAX_WORDS.toLocaleString()} words`}</span>
                      </span>
                    </div>
                    {wordCount > 0 && (
                      <p className="text-xs text-slate-400 dark:text-slate-500">
                        {sentenceCount} sentence{sentenceCount !== 1 ? 's' : ''} · ~{readMinutes} min read
                      </p>
                    )}
                  </div>

                  {tells.length > 0 && (
                    <div className="mt-3 rounded-xl border border-amber-200/80 dark:border-amber-800/50 bg-amber-50/70 dark:bg-amber-950/20 px-3 py-2.5 animate-fade-in">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1.5">
                        {tells.length} AI-style phrase{tells.length !== 1 ? 's' : ''} spotted
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {tells.slice(0, 6).map((t) => (
                          <span key={t} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/60 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300">
                            {t}
                          </span>
                        ))}
                        {tells.length > 6 && <span className="text-[11px] text-amber-700 dark:text-amber-400 self-center">+{tells.length - 6} more</span>}
                      </div>
                    </div>
                  )}

                  {isOverLimit && (
                    <p className="mt-3 text-red-500 dark:text-red-400 text-xs flex items-center gap-1 flex-wrap">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                      Remove {wordCount - MAX_WORDS} word{wordCount - MAX_WORDS !== 1 ? 's' : ''} to continue
                      <>
                          {' — or '}
                          <Link href="/pricing" className="underline font-semibold hover:text-red-600">upgrade</Link>
                          {' for larger limits'}
                        </>
                    </p>
                  )}
                </div>

                <div className="px-4 sm:px-5 pb-5">
                  <button
                    type="button"
                    onClick={handleHumanize}
                    disabled={isLoading || isOverLimit || !inputText.trim()}
                    className="btn-primary w-full py-4 text-base font-bold gap-3 justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                  >
                    {isLoading ? (
                      <><Spinner className="h-5 w-5" /> Humanizing your text…</>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Humanize · {activeStyle.label}
                      </>
                    )}
                  </button>
                  <p className="mt-2.5 text-center text-[11px] text-slate-400 dark:text-slate-500">
                    Press{' '}
                    <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 font-sans font-semibold text-slate-500 dark:text-slate-400">Ctrl</kbd>{' '}+{' '}
                    <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 font-sans font-semibold text-slate-500 dark:text-slate-400">Enter</kbd>{' '}
                    to humanize
                  </p>
                </div>
              </div>

              {/* ───────── OUTPUT ───────── */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/40 overflow-hidden flex flex-col">
                <div className="px-4 sm:px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center flex-shrink-0">
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-white">Humanized result</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {resultReady ? `${outputWordCount} words${rewordedPct !== null ? ` · ${rewordedPct}% reworded` : ''}` : 'Natural, human-sounding writing'}
                      </p>
                    </div>
                  </div>

                  {resultReady && (
                    <div className="inline-flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0" role="tablist" aria-label="Result view">
                      {(['clean', 'changes'] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          role="tab"
                          aria-selected={view === v}
                          onClick={() => setView(v)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${
                            view === v
                              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-card'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                          }`}
                        >
                          {v === 'clean' ? 'Clean' : 'Changes'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 p-4 sm:p-5">
                  <div className="min-h-[18rem]" aria-live="polite">
                    {isLoading ? (
                      <div className="h-72 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-900/50 p-5 flex flex-col">
                        <ol className="space-y-2.5 mb-5">
                          {LOADING_STEPS.map((label, i) => {
                            const done = i < stepIndex;
                            const current = i === stepIndex;
                            return (
                              <li key={label} className={`flex items-center gap-2.5 text-sm transition-colors ${
                                done ? 'text-emerald-600 dark:text-emerald-400' : current ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-400 dark:text-slate-600'
                              }`}>
                                <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                                  {done ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                  ) : current ? (
                                    <Spinner className="w-4 h-4 text-blue-500" />
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                                  )}
                                </span>
                                {label}
                              </li>
                            );
                          })}
                        </ol>
                        <div className="space-y-2.5 flex-1">
                          {['w-full', 'w-11/12', 'w-full', 'w-4/5', 'w-10/12', 'w-3/5'].map((w, i) => (
                            <div key={i} className={`skeleton-line h-3 ${w}`} style={{ animationDelay: `${i * 90}ms` }} />
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 tabular-nums">
                          {Math.floor(elapsed)}s · usually 5–15 seconds
                        </p>
                      </div>
                    ) : isRevealing ? (
                      <div className="relative h-72 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-900/50">
                        <div className="h-full overflow-y-auto p-4 pb-12 text-sm leading-7 text-slate-800 dark:text-slate-100">
                          <span className="type-caret">{outputText.slice(0, revealed ?? 0)}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setRevealed(null)}
                          className="absolute bottom-3 right-3 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full shadow-card"
                        >
                          Skip
                        </button>
                      </div>
                    ) : outputText && view === 'changes' ? (
                      <div className="h-72 overflow-y-auto rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-900/50 p-4 text-sm leading-7">
                        {diffParts?.map((part, i) => (
                          <span
                            key={i}
                            className={
                              part.added
                                ? 'bg-emerald-200/60 dark:bg-emerald-500/25 text-emerald-800 dark:text-emerald-200 rounded px-0.5'
                                : part.removed
                                ? 'bg-red-200/60 dark:bg-red-500/25 text-red-700 dark:text-red-300 line-through rounded px-0.5'
                                : 'text-slate-700 dark:text-slate-300'
                            }
                          >
                            {part.value}
                          </span>
                        ))}
                      </div>
                    ) : outputText ? (
                      <div className="relative h-72 rounded-2xl border border-slate-200/70 dark:border-slate-700/60 bg-slate-50/70 dark:bg-slate-900/50">
                        <div className="h-full overflow-y-auto p-4 pb-16 text-sm leading-7 text-slate-800 dark:text-slate-100">
                          {outputSentences.map((sentence, i) => {
                            const selected = selectedIndex === i;
                            return (
                              <span key={i}>
                                <span
                                  role="button"
                                  tabIndex={0}
                                  aria-pressed={selected}
                                  onClick={() => setSelectedIndex(selected ? null : i)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedIndex(selected ? null : i); }
                                  }}
                                  className={`cursor-pointer rounded transition-colors ${
                                    regeneratingIndex === i ? 'opacity-40' : ''
                                  } ${
                                    selected
                                      ? 'bg-blue-100 dark:bg-blue-900/40 ring-1 ring-blue-300 dark:ring-blue-700'
                                      : 'hover:bg-blue-50 dark:hover:bg-blue-950/40'
                                  }`}
                                >
                                  {sentence}
                                </span>{' '}
                              </span>
                            );
                          })}
                          {selectedIndex === null && (
                            <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">Tap any sentence to rewrite just that one.</p>
                          )}
                        </div>

                        {selectedIndex !== null && (
                          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-xl bg-white/95 dark:bg-slate-800/95 border border-slate-200 dark:border-slate-700 px-3 py-2 shadow-card-lg animate-fade-in">
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Sentence {selectedIndex + 1} selected</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleRegenerateSentence(selectedIndex)}
                                disabled={regeneratingIndex !== null}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-violet-600 px-3 py-1.5 rounded-lg disabled:opacity-50"
                              >
                                {regeneratingIndex === selectedIndex ? <Spinner className="w-3.5 h-3.5" /> : (
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                )}
                                Rewrite
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedIndex(null)}
                                aria-label="Deselect sentence"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-72 rounded-2xl border border-dashed border-slate-300/80 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col items-center justify-center text-center px-6">
                        <div className="relative mb-4">
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 blur-xl opacity-30" aria-hidden />
                          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                          </div>
                        </div>
                        <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Your result appears here</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 max-w-[15rem] leading-relaxed">
                          Pick a style, paste your draft and hit Humanize. You&apos;ll get the rewrite, a diff of what changed and a before/after Human Score.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Human Score */}
                  {resultReady && inputScore !== null && outputScore !== null && (
                    <div className="mt-4 rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/80 to-violet-50/80 dark:from-blue-950/30 dark:to-violet-950/30 p-4 animate-fade-in">
                      <div className="flex items-center gap-1.5 mb-3">
                        <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Human Score</span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">— our own free, instant estimate</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 sm:gap-8">
                        <ScoreGauge label="Before" score={inputScore} />
                        <div className="flex flex-col items-center gap-1.5">
                          <svg className="w-5 h-5 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                          <span className={`text-xs font-black tabular-nums px-2 py-0.5 rounded-full ${
                            scoreDelta > 0
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}>
                            {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta === 0 ? 'no change' : scoreDelta}
                          </span>
                        </div>
                        <ScoreGauge label="After" score={outputScore} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-4 sm:px-5 pb-5 grid grid-cols-3 gap-2.5">
                  <button type="button" onClick={handleCopy} disabled={!resultReady}
                    className="btn-secondary !px-3 py-3.5 gap-2 justify-center font-semibold text-sm">
                    {copied ? (
                      <><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copied</>
                    ) : (
                      <><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>
                    )}
                  </button>
                  <button type="button" onClick={handleDownload} disabled={!resultReady}
                    className="btn-secondary !px-3 py-3.5 gap-2 justify-center font-semibold text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    .txt
                  </button>
                  <button type="button" onClick={handleUseAsInput} disabled={!resultReady}
                    title="Move the result back into the input to humanize it again"
                    className="btn-secondary !px-3 py-3.5 gap-2 justify-center font-semibold text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-xl flex items-start gap-3 animate-fade-in" role="alert">
          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400 text-sm">Something went wrong</p>
            <p className="text-red-600 dark:text-red-400/80 text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Footer note */}
      <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-x-5 gap-y-2 flex-wrap">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          {user ? 'Saved to your history' : 'Text is never stored'}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          {unlimited ? 'No per-request word cap' : `Up to ${MAX_WORDS.toLocaleString()} words per request`}
        </span>
        {!user && (
          <Link href={signupHref} className="flex items-center gap-1.5 text-blue-500 hover:text-blue-600 font-semibold">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            Sign up free to save your history
          </Link>
        )}
      </p>
    </div>
  );
}
