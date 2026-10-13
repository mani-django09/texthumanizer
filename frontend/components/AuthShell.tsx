import Link from 'next/link';

const PERKS = [
  { title: 'Usage dashboard', text: 'See how many words you have used this month.' },
  { title: 'Saved history', text: 'Every humanize, check and scan kept in your dashboard.' },
  { title: 'Earn bonus words', text: 'Invite a friend and you both get 200 extra words.' },
];

/**
 * Split-screen shell for the auth pages: a branded value panel on the left
 * (hidden on mobile, where it would just push the form below the fold) and
 * the form card on the right.
 */
export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center
                        bg-gradient-to-b from-slate-50 via-white to-slate-50
                        dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 aurora opacity-40" aria-hidden />
      <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden />
      <div className="orb w-80 h-80 -top-32 -right-24 bg-blue-400/10 dark:bg-blue-500/10 animate-float" aria-hidden />
      <div className="orb w-64 h-64 -bottom-28 -left-24 bg-violet-400/10 dark:bg-violet-500/10 animate-float-delayed" aria-hidden />

      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">

          {/* ── Brand / value panel ── */}
          <div className="hidden lg:block">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-8 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-glow-sm group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                  <path d="M21.5 7.5c-4.8 0-9 3.9-10.3 9.3-.3 1.2-.5 2.5-.5 3.8 1.3 0 2.6-.2 3.8-.5 5.4-1.3 9.3-5.5 9.3-10.3 0-.8-.1-1.5-.3-2.3-.7-.2-1.4-.3-2-.3z" fill="#fff" fillOpacity="0.96"/>
                  <path d="M14 18c-2 2-3 4-3.2 6.2" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M23 6.2l.55 1.35 1.35.55-1.35.55-.55 1.35-.55-1.35-1.35-.55 1.35-.55L23 6.2z" fill="#fff"/>
                </svg>
              </div>
              <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">Text Humanizer</span>
            </Link>

            <h2 className="text-3xl xl:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4">
              Writing that sounds like{' '}
              <span className="gradient-text">a person wrote it</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-9 max-w-md">
              A free account keeps your work in one place and lets you earn bonus words.
            </p>

            <ul className="space-y-5">
              {PERKS.map((p) => (
                <li key={p.title} className="flex items-start gap-3.5">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mt-0.5">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">{p.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mt-0.5">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2 mt-9">
              <span className="inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-3 py-1.5 rounded-full font-semibold border border-green-200 dark:border-green-800/60">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                Free forever plan
              </span>
              <span className="inline-flex items-center text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-full font-semibold border border-blue-200 dark:border-blue-800/60">
                No card required
              </span>
            </div>
          </div>

          {/* ── Form card ── */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="glass-card p-7 sm:p-9">{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
