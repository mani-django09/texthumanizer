import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center
                        bg-gradient-to-b from-slate-50 via-blue-50/20 to-white
                        dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 grid-pattern opacity-60" aria-hidden />
      <div className="orb w-[500px] h-[500px] -top-40 -right-40 bg-blue-400/10 dark:bg-blue-500/10 animate-float" aria-hidden />
      <div className="orb w-[400px] h-[400px] -bottom-32 -left-40 bg-violet-400/10 dark:bg-violet-500/10 animate-float-delayed" aria-hidden />

      <div className="relative container-max section-padding text-center max-w-2xl mx-auto">
        <div className="text-8xl sm:text-9xl font-black gradient-text leading-none mb-4">404</div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          This page wandered off
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to humanizing text.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-secondary text-base py-4 px-7 w-full sm:w-auto">
            Back to Home
          </Link>
          <Link href="/ai-humanizer" className="btn-primary-lg gap-2.5 shadow-glow-md btn-glow text-base w-full sm:w-auto">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Humanize Text — It&apos;s Free
          </Link>
        </div>
      </div>
    </section>
  );
}
