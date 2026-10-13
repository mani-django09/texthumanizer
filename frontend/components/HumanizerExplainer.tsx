'use client';

import { useState } from 'react';

/* ───────────────────────── Tells explorer ───────────────────────── */

export interface Tell {
  phrase: string;
  why: string;
  before: string;
  after: string;
}

/**
 * Click a "giveaway" on the left, see a before/after example and the reason on
 * the right. Examples are illustrative — they show the kind of edit, not a
 * guaranteed output for any particular text.
 */
export function TellsExplorer({ tells }: { tells: Tell[] }) {
  const [active, setActive] = useState(0);
  const current = tells[active];

  return (
    <div className="grid lg:grid-cols-5 gap-5 items-stretch">
      <div className="lg:col-span-2 space-y-2" role="tablist" aria-label="AI writing giveaways" aria-orientation="vertical">
        {tells.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={t.phrase}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(i)}
              className={`w-full text-left rounded-2xl border px-4 py-3.5 transition-all duration-300 flex items-center gap-3 ${
                on
                  ? 'bg-white dark:bg-slate-900 border-transparent shadow-card-lg ring-2 ring-violet-500/40'
                  : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 hover:-translate-y-0.5'
              }`}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 transition-colors ${
                on ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {i + 1}
              </span>
              <span className={`text-sm font-semibold leading-snug ${on ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                {t.phrase}
              </span>
            </button>
          );
        })}
      </div>

      <div className="lg:col-span-3 card-premium rounded-3xl p-5 sm:p-7 flex flex-col" role="tabpanel" key={active}>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-5 animate-fade-in">{current.why}</p>

        <div className="space-y-3 flex-1 animate-fade-in">
          <div className="rounded-2xl border border-red-200/70 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/20 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-red-500 mb-1.5">Reads like AI</p>
            <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{current.before}</p>
          </div>

          <div className="flex justify-center -my-1">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-white flex items-center justify-center shadow-glow-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </span>
          </div>

          <div className="rounded-2xl border border-emerald-200/70 dark:border-emerald-800/50 bg-emerald-50/60 dark:bg-emerald-950/20 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">Reads human</p>
            <p className="text-sm leading-6 text-slate-800 dark:text-slate-100">{current.after}</p>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">Illustrative example — real output depends on your text.</p>
      </div>
    </div>
  );
}

/* ───────────────────────── Style showcase ───────────────────────── */

export interface StyleSample {
  id: string;
  label: string;
  output: string;
}

/** Same sentence, five styles — pick a tab to see how the tone shifts. */
export function StyleShowcase({ original, samples }: { original: string; samples: StyleSample[] }) {
  const [active, setActive] = useState(samples[0]?.id);
  const current = samples.find((s) => s.id === active) || samples[0];

  return (
    <div className="card-premium rounded-3xl p-5 sm:p-8">
      <div className="rounded-2xl border border-red-200/70 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/20 p-4 mb-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-red-500 mb-1.5">Original AI draft</p>
        <p className="text-sm sm:text-base leading-7 text-slate-700 dark:text-slate-300">{original}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5" role="tablist" aria-label="Rewrite styles">
        {samples.map((s) => {
          const on = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(s.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                on
                  ? 'bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-glow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <div key={current.id} className="rounded-2xl border border-emerald-200/70 dark:border-emerald-800/50 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 sm:p-5 animate-fade-in" role="tabpanel">
        <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">{current.label} rewrite</p>
        <p className="text-sm sm:text-base leading-7 text-slate-800 dark:text-slate-100">{current.output}</p>
      </div>

      <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">Illustrative examples — real output varies with your text.</p>
    </div>
  );
}
