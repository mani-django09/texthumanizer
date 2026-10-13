import Link from 'next/link';

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Shared premium page header — aurora wash, grid pattern, floating orbs
 * and an optional breadcrumb trail. Used across every secondary page so
 * headers stay visually consistent with the tool pages.
 */
export default function PageHero({
  title,
  highlight,
  subtitle,
  crumbs,
  children,
}: {
  title: string;
  highlight?: string;
  subtitle?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-700/40">
      <div className="absolute inset-0 aurora opacity-40" aria-hidden />
      <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden />
      <div className="orb w-72 h-72 -top-28 -right-24 bg-blue-400/10 dark:bg-blue-500/10 animate-float" aria-hidden />
      <div className="orb w-56 h-56 -bottom-24 -left-20 bg-violet-400/10 dark:bg-violet-500/10 animate-float-delayed" aria-hidden />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 text-center">
        {crumbs && crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-2">
                {i > 0 && (
                  <svg className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {c.href ? (
                  <Link href={c.href} className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {c.label}
                  </Link>
                ) : (
                  <span className="font-medium text-slate-700 dark:text-slate-300">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
          {title}
          {highlight && (
            <>
              {' '}
              <span className="gradient-text">{highlight}</span>
            </>
          )}
        </h1>

        {subtitle && (
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}

        {children}
      </div>
    </div>
  );
}
