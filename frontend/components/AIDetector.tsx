'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { wordLimitFor } from '@/lib/limits';

const API_URL   = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const SAMPLE_TEXT =
  'In today\'s fast-paced world, it is important to note that artificial intelligence plays a crucial role in shaping how we communicate. Furthermore, it is evident that these tools continue to evolve rapidly.';

interface SentenceFlag {
  sentence: string;
  flagged: boolean;
  reason: string | null;
}

interface AIDetectResult {
  score: number;
  verdict: 'likely-human' | 'mixed' | 'likely-ai';
  burstiness: number;
  signaturePhraseCount: number;
  repetitionRatio: number;
  sentences: SentenceFlag[];
}

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
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

const VERDICT_STYLES: Record<AIDetectResult['verdict'], { label: string; color: string; ring: string; bg: string }> = {
  'likely-human': { label: 'Likely Human-Written', color: 'text-emerald-500', ring: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50' },
  'mixed':        { label: 'Mixed Signals',         color: 'text-amber-500',  ring: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50' },
  'likely-ai':    { label: 'Likely AI-Generated',   color: 'text-red-500',    ring: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/50' },
};

function ScoreRing({ score, verdict }: { score: number; verdict: AIDetectResult['verdict'] }) {
  const style = VERDICT_STYLES[verdict];
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-700" />
        <circle
          cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className={`${style.ring} transition-all duration-1000`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-black ${style.color}`}>{score}%</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Human</span>
      </div>
    </div>
  );
}

export default function AIDetector() {
  const { user } = useAuth();

  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<AIDetectResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { max: MAX_WORDS, unlimited } = wordLimitFor(user);
  const wordCount   = countWords(inputText);
  const isOverLimit = wordCount > MAX_WORDS;
  const pct         = Math.min((wordCount / MAX_WORDS) * 100, 100);

  const handleCheck = useCallback(async () => {
    if (!inputText.trim()) { setError('Please enter some text to analyze.'); return; }
    if (isOverLimit)       { setError(`Word limit exceeded. Please reduce to ${MAX_WORDS} words.`); return; }

    setIsLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch(`${API_URL}/api/ai-detect`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI detection failed. Please try again.');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isOverLimit, MAX_WORDS]);

  const handleClear = useCallback(() => {
    setInputText(''); setResult(null); setError('');
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleCheck();
    }
  }, [handleCheck]);

  const flaggedCount = result?.sentences.filter((s) => s.flagged).length || 0;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="card-premium rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-blue-950/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="icon-box-blue w-8 h-8 rounded-lg text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">AI Content Detector</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Estimates how likely text is AI-written</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold tabular-nums px-2.5 py-1 rounded-full border ${
              isOverLimit
                ? 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
                : wordCount > MAX_WORDS * 0.8
                ? 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                : 'text-slate-500 bg-slate-100 border-slate-200 dark:bg-slate-700/50 dark:text-slate-400 dark:border-slate-600'
            }`}>
              {wordCount}/{unlimited ? '∞' : MAX_WORDS}
            </span>
            {inputText && (
              <button onClick={handleClear} title="Clear"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="p-5">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste your text here to check how AI-like it reads…"
              className="textarea-base h-56"
              aria-label="Text to analyze for AI content"
            />
            {!inputText && (
              <button
                type="button"
                onClick={() => { setInputText(SAMPLE_TEXT); setError(''); }}
                className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 text-xs font-semibold
                           text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40
                           border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-full
                           hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Try a sample
              </button>
            )}
          </div>

          <div className="mt-3 space-y-1.5">
            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${
                isOverLimit ? 'bg-red-500' : wordCount > MAX_WORDS * 0.8 ? 'bg-amber-500' : 'bg-gradient-to-r from-blue-500 to-violet-500'
              }`} style={{ width: `${pct}%` }}/>
            </div>
            {isOverLimit && (
              <p className="text-red-500 dark:text-red-400 text-xs flex items-center gap-1 flex-wrap">
                Remove {wordCount - MAX_WORDS} word{wordCount - MAX_WORDS !== 1 ? 's' : ''} to continue
                <>
                    {' — or '}
                    <Link href="/pricing" className="underline font-semibold hover:text-red-600">upgrade</Link>
                    {' for larger limits'}
                  </>
              </p>
            )}
          </div>
        </div>

        {/* Button */}
        <div className="px-5 pb-5">
          <button
            onClick={handleCheck}
            disabled={isLoading || isOverLimit || !inputText.trim()}
            className="btn-primary w-full py-4 text-base font-bold gap-3 justify-center
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
            {isLoading ? (
              <>
                <Spinner className="h-5 w-5"/>
                Analyzing…
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                Detect AI Content
              </>
            )}
          </button>
          <p className="mt-2.5 text-center text-[11px] text-slate-400 dark:text-slate-500">
            Press{' '}
            <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 font-sans font-semibold text-slate-500 dark:text-slate-400">Ctrl</kbd>{' '}
            +{' '}
            <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 font-sans font-semibold text-slate-500 dark:text-slate-400">Enter</kbd>{' '}
            to analyze
          </p>
        </div>

        {/* Results */}
        {result && !isLoading && (
          <div className="border-t border-slate-100 dark:border-slate-700/50 p-5">
            <div className={`flex items-center gap-5 mb-5 p-4 rounded-xl border ${VERDICT_STYLES[result.verdict].bg}`}>
              <ScoreRing score={result.score} verdict={result.verdict} />
              <div>
                <p className={`font-black text-lg mb-1 ${VERDICT_STYLES[result.verdict].color}`}>
                  {VERDICT_STYLES[result.verdict].label}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {flaggedCount === 0
                    ? 'No obvious AI-signature phrases found.'
                    : `${flaggedCount} sentence${flaggedCount !== 1 ? 's' : ''} contain common AI phrasing.`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-lg font-black text-slate-800 dark:text-white">{result.burstiness}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide mt-0.5">Sentence Variance</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-lg font-black text-slate-800 dark:text-white">{result.signaturePhraseCount}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide mt-0.5">AI Phrases Found</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-lg font-black text-slate-800 dark:text-white">{Math.round(result.repetitionRatio * 100)}%</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide mt-0.5">Word Repetition</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {result.sentences.map((s, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border text-sm leading-relaxed ${
                    s.flagged
                      ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50'
                      : 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200/60 dark:border-emerald-800/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      s.flagged ? 'bg-red-500' : 'bg-emerald-500'
                    }`}>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {s.flagged ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.7-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        )}
                      </svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 dark:text-slate-200">{s.sentence}</p>
                      {s.flagged && s.reason && (
                        <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{s.reason}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="border-t border-slate-100 dark:border-slate-700/50 p-10 flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
                <Spinner className="h-7 w-7 text-white"/>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 animate-ping opacity-20"/>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Analyzing writing patterns…</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">This only takes a moment</p>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-xl flex items-start gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-red-700 dark:text-red-400 text-sm">Error</p>
            <p className="text-red-600 dark:text-red-400/80 text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">
        This is our own statistical heuristic (sentence-length variance, AI-signature phrases, word repetition) —
        not GPTZero, Originality.ai, Turnitin, or any trained AI-detection model. Treat it as a rough signal, not proof.
      </p>
    </div>
  );
}
