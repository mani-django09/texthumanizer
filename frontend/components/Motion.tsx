'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Fades a block up as it scrolls into view. Content is fully visible in the
 * server-rendered HTML (crawlers, no-JS) — it is only hidden after hydration,
 * and only when it starts below the fold, so there is never a flash of nothing.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'visible' | 'hidden' | 'shown'>('visible');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    setState('hidden');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown');
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${state === 'hidden' ? 'reveal-hidden' : state === 'shown' ? 'reveal-shown' : ''} ${className}`}
      style={state === 'shown' && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/** Cycles through a list of words with a soft slide/fade. First word is server-rendered. */
export function RotatingWords({ words, interval = 2400 }: { words: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (words.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let swap: ReturnType<typeof setTimeout>;
    const tick = setInterval(() => {
      setPhase('out');
      swap = setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setPhase('in');
      }, 260);
    }, interval);

    return () => {
      clearInterval(tick);
      clearTimeout(swap);
    };
  }, [words, interval]);

  return (
    <span
      className={`inline-block gradient-text-animated transition-all duration-300 ${
        phase === 'in' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
      aria-live="off"
    >
      {words[index]}
    </span>
  );
}
