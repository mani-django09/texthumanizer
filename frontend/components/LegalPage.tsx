import Link from 'next/link';

export interface LegalSection {
  heading: string;
  body: React.ReactNode;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Shared shell for the legal pages. Renders a premium header plus a sticky
 * table of contents beside numbered section cards — far easier to navigate
 * than one long undifferentiated wall of text.
 */
export default function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

      {/* ── Header ── */}
      <div className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-700/40">
        <div className="absolute inset-0 aurora opacity-30" aria-hidden />
        <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden />
        <div className="orb w-72 h-72 -top-28 -right-24 bg-blue-400/10 dark:bg-blue-500/10 animate-float" aria-hidden />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
            <Link href="/" className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            <svg className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-medium text-slate-700 dark:text-slate-300">{title}</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            {title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-5">{intro}</p>
          <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 rounded-full">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Last updated: {updated}
          </p>
        </div>
      </div>

      {/* ── TOC + sections ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-12">

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                On this page
              </p>
              <nav className="space-y-1 border-l border-slate-200 dark:border-slate-700">
                {sections.map((s, i) => (
                  <a
                    key={s.heading}
                    href={`#${slugify(s.heading)}`}
                    className="flex gap-2.5 pl-4 -ml-px border-l-2 border-transparent py-1.5 text-sm text-slate-500 dark:text-slate-400
                               hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 transition-colors leading-snug"
                  >
                    <span className="text-slate-300 dark:text-slate-600 font-bold tabular-nums flex-shrink-0">{i + 1}</span>
                    {s.heading}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="space-y-5 max-w-3xl">
            {sections.map((s, i) => (
              <section
                key={s.heading}
                id={slugify(s.heading)}
                className="scroll-mt-24 card-premium p-6 sm:p-8"
              >
                <div className="flex items-start gap-4 mb-4">
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white font-black text-sm flex items-center justify-center shadow-glow-xs">
                    {i + 1}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight pt-1.5">
                    {s.heading}
                  </h2>
                </div>
                <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-3 text-[15px]">
                  {s.body}
                </div>
              </section>
            ))}

            <div className="card-premium p-6 sm:p-8 text-center">
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-5">
                Still have questions about this policy? We&apos;re happy to explain anything here in plain language.
              </p>
              <Link href="/contact" className="btn-secondary text-sm">Contact us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
