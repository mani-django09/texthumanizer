'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { wordLimitFor } from '@/lib/limits';

const API_URL   = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const SAMPLE_TEXT =
  'The quick brown fox jumps over the lazy dog. This sentence has been used as a typing test for decades because it contains every letter of the English alphabet at least once.';

interface SentenceResult {
  sentence: string;
  matched: boolean;
  source?: string;
  sourceTitle?: string;
  error?: boolean;
}

interface PlagiarismResult {
  originalityScore: number;
  results: SentenceResult[];
  checkedCount: number;
  totalSentences: number;
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

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500';
  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-200 dark:text-slate-700" />
        <circle
          cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          className={`${color} transition-all duration-1000`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-black ${color}`}>{score}%</span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Original</span>
      </div>
    </div>
  );
}

export default function PlagiarismChecker() {
  const { user } = useAuth();

  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { max: MAX_WORDS, unlimited } = wordLimitFor(user);
  const wordCount   = countWords(inputText);
  const isOverLimit = wordCount > MAX_WORDS;
  const pct         = Math.min((wordCount / MAX_WORDS) * 100, 100);

  const handleCheck = useCallback(async () => {
    if (!inputText.trim()) { setError('Please enter some text to check.'); return; }
    if (isOverLimit)       { setError(`Word limit exceeded. Please reduce to ${MAX_WORDS} words.`); return; }

    setIsLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch(`${API_URL}/api/plagiarism-check`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Plagiarism check failed. Please try again.');
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

  const matchedCount = result?.results.filter((r) => r.matched).length || 0;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="card-premium rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-violet-50/30 dark:from-slate-800/50 dark:to-violet-950/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="icon-box-violet w-8 h-8 rounded-lg text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-white">Plagiarism Checker</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Scans the live web for matching text</p>
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
              placeholder="Paste your text here to scan for matches on the web…"
              className="textarea-base h-56"
              aria-label="Text to check for plagiarism"
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
                isOverLimit ? 'bg-red-500' : wordCount > MAX_WORDS * 0.8 ? 'bg-amber-500' : 'bg-gradient-to-r from-violet-500 to-purple-500'
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
                Scanning the web…
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                Check for Plagiarism
              </>
            )}
          </button>
          <p className="mt-2.5 text-center text-[11px] text-slate-400 dark:text-slate-500">
            Press{' '}
            <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 font-sans font-semibold text-slate-500 dark:text-slate-400">Ctrl</kbd>{' '}
            +{' '}
            <kbd className="px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 font-sans font-semibold text-slate-500 dark:text-slate-400">Enter</kbd>{' '}
            to check
          </p>
        </div>

        {/* Results */}
        {result && !isLoading && (
          <div className="border-t border-slate-100 dark:border-slate-700/50 p-5">
            <div className="flex items-center gap-5 mb-5">
              <ScoreRing score={result.originalityScore} />
              <div>
                <p className="font-bold text-slate-800 dark:text-white mb-1">
                  {matchedCount === 0
                    ? 'No web matches found'
                    : `${matchedCount} of ${result.results.length} sentences matched existing content`}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Scanned {result.checkedCount} of {result.totalSentences} sentence{result.totalSentences !== 1 ? 's' : ''} against the live web.
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {result.results.map((r, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border text-sm leading-relaxed ${
                    r.matched
                      ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50'
                      : 'bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-200/60 dark:border-emerald-800/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                      r.matched ? 'bg-red-500' : 'bg-emerald-500'
                    }`}>
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {r.matched ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        )}
                      </svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 dark:text-slate-200">{r.sentence}</p>
                      {r.matched && r.source && (
                        <a
                          href={r.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 hover:underline mt-1.5"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {r.sourceTitle || 'View source'}
                        </a>
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
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-glow-sm">
                <Spinner className="h-7 w-7 text-white"/>
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 animate-ping opacity-20"/>
            </div>
            <div className="text-center">
              <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Scanning the web for matches…</p>
              <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">This can take up to 20 seconds</p>
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
        We sample a handful of sentences and check them against live web search results — a quick scan, not an exhaustive database search like paid tools use.
      </p>
    </div>
  );
}
