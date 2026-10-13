'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { diffWords } from 'diff';
import { useAuth } from './AuthContext';
import { wordLimitFor } from '@/lib/limits';

const API_URL   = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const SAMPLE_TEXT =
  'Their are many reason why grammar mistakes happens in writing, specially when your typing fast and dont have time to proofread you work carefully.';

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

export default function GrammarChecker() {
  const { user } = useAuth();

  const [inputText,  setInputText]  = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState('');
  const [copied,     setCopied]     = useState(false);
  const [showDiff,   setShowDiff]   = useState(true);

  const { max: MAX_WORDS, unlimited } = wordLimitFor(user);
  const wordCount       = countWords(inputText);
  const outputWordCount = countWords(outputText);
  const isOverLimit     = wordCount > MAX_WORDS;
  const pct             = Math.min((wordCount / MAX_WORDS) * 100, 100);

  const handleCheck = useCallback(async () => {
    if (!inputText.trim()) { setError('Please enter some text to check.'); return; }
    if (isOverLimit)       { setError(`Word limit exceeded. Please reduce to ${MAX_WORDS} words.`); return; }

    setIsLoading(true); setError(''); setOutputText('');
    try {
      const res  = await fetch(`${API_URL}/api/grammar-check`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Grammar check failed. Please try again.');
      setOutputText(data.correctedText);
    } catch (err) {
      setError(
        err instanceof TypeError && String(err).includes('fetch')
          ? 'Cannot connect to server. Please try again.'
          : err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [inputText, isOverLimit, MAX_WORDS]);

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

  const handleDownload = useCallback(() => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'grammar-checked-text.txt';
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  }, [outputText]);

  const handleClear = useCallback(() => {
    setInputText(''); setOutputText(''); setError('');
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleCheck();
    }
  }, [handleCheck]);

  const diffParts = showDiff && outputText ? diffWords(inputText, outputText) : null;
  const changeCount = diffParts ? diffParts.filter((p) => p.added || p.removed).length / 2 : 0;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* INPUT PANEL */}
        <div className="card-premium rounded-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800/50 dark:to-blue-950/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="icon-box-blue w-8 h-8 rounded-lg text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Text to Check</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Paste any text — essays, emails, drafts</p>
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

          <div className="flex-1 p-5">
            <div className="relative">
              <textarea
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Paste your text here to check for grammar, spelling, and punctuation errors…"
                className="textarea-base h-64 xl:h-72"
                aria-label="Text to check"
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
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
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

          <div className="px-5 pb-5">
            <button
              onClick={handleCheck}
              disabled={isLoading || isOverLimit || !inputText.trim()}
              className="btn-primary w-full py-4 text-base font-bold gap-3 justify-center
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
              {isLoading ? (
                <>
                  <Spinner className="h-5 w-5"/>
                  Checking grammar…
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.5l2 2 4.5-4.5M12 3a9 9 0 100 18 9 9 0 000-18z"/>
                  </svg>
                  Check Grammar
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
        </div>

        {/* OUTPUT PANEL */}
        <div className="card-premium rounded-2xl overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-emerald-50/30 dark:from-slate-800/50 dark:to-emerald-950/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="icon-box-green w-8 h-8 rounded-lg text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.5l2 2 4.5-4.5M12 3a9 9 0 100 18 9 9 0 000-18z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">Corrected Text</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {outputText ? `${Math.round(changeCount)} correction${Math.round(changeCount) !== 1 ? 's' : ''} made` : 'Errors fixed, style untouched'}
                </p>
              </div>
            </div>
            {outputText && !isLoading && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full">
                  {outputWordCount} words
                </span>
                <button
                  onClick={() => setShowDiff((v) => !v)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors ${
                    showDiff
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Highlight fixes
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 p-5 relative">
            {outputText && !isLoading && showDiff ? (
              <div className="textarea-base h-64 xl:h-72 overflow-y-auto bg-slate-50/70 dark:bg-slate-900/50 leading-7">
                {diffParts?.map((part, i) => (
                  <span
                    key={i}
                    className={
                      part.added
                        ? 'bg-emerald-200/60 dark:bg-emerald-500/25 text-emerald-800 dark:text-emerald-200 rounded px-0.5'
                        : part.removed
                        ? 'bg-red-200/60 dark:bg-red-500/25 text-red-700 dark:text-red-300 line-through rounded px-0.5'
                        : ''
                    }
                  >
                    {part.value}
                  </span>
                ))}
              </div>
            ) : (
              <textarea
                value={outputText}
                readOnly
                placeholder="Your corrected text will appear here…&#10;&#10;Click 'Check Grammar' to get started."
                className="textarea-base h-64 xl:h-72 bg-slate-50/70 dark:bg-slate-900/50 cursor-default"
                aria-label="Corrected text"
                aria-live="polite"
              />
            )}

            {isLoading && (
              <div className="absolute inset-5 rounded-xl flex flex-col items-center justify-center gap-4
                              bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
                    <Spinner className="h-7 w-7 text-white"/>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 animate-ping opacity-20"/>
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">Checking grammar…</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">This typically takes 5–15 seconds</p>
                </div>
              </div>
            )}
          </div>

          <div className="px-5 pb-5 grid grid-cols-2 gap-3">
            <button onClick={handleCopy} disabled={!outputText || isLoading}
              className="btn-secondary py-3.5 gap-2 justify-center font-semibold">
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  Copy Text
                </>
              )}
            </button>
            <button onClick={handleDownload} disabled={!outputText || isLoading}
              className="btn-secondary py-3.5 gap-2 justify-center font-semibold">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Download .txt
            </button>
          </div>
        </div>
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

      <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-4 flex-wrap">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          {user ? 'Saved to your history' : 'Text is never stored'}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          {unlimited ? 'No per-request word cap' : `Up to ${MAX_WORDS.toLocaleString()} words per request`}
        </span>
      </p>
    </div>
  );
}
