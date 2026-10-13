import type { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts, coverFor } from '@/lib/blogPosts';
import PageHero from '@/components/PageHero';
import { abs, ogImage } from '@/lib/site';

const OG_IMAGE = ogImage('Writing Tips & AI Insights', 'Text Humanizer Blog');

export const metadata: Metadata = {
  title: 'Blog – Writing Tips & AI Insights',
  description:
    'Guides on humanizing AI text, understanding AI detectors, and writing that actually sounds like you.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog – Writing Tips & AI Insights | Text Humanizer',
    description: 'Guides on humanizing AI text, understanding AI detectors, and writing that sounds like you.',
    url: abs('/blog'),
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog – Writing Tips & AI Insights | Text Humanizer',
    description: 'Guides on humanizing AI text and writing that sounds like you.',
    images: [OG_IMAGE],
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BlogIndexPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const [featured, ...rest] = sorted;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <PageHero
        title="Writing Tips &"
        highlight="AI Insights"
        subtitle="Guides on humanizing AI text, understanding detectors, and writing that actually sounds like you."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Featured post ── */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group block mb-10">
            <article className="relative overflow-hidden rounded-3xl card-premium transition-all duration-500 hover:-translate-y-1 hover:shadow-card-xl grid lg:grid-cols-[1.2fr_1fr]">
              <div className="overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverFor(featured.slug)}
                  alt={`Cover image for the article: ${featured.title}`}
                  width={1200}
                  height={630}
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>

              <div className="relative p-7 sm:p-9 flex flex-col justify-center">
                <div className="badge-amber inline-flex mb-5">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                  Latest article
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {featured.title}
                </h2>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base max-w-2xl mb-6">
                  {featured.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400 dark:text-slate-500">
                  <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time>
                  <span aria-hidden>·</span>
                  <span>{featured.readTime}</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400 ml-auto">
                    Read article
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          </Link>
        )}

        {/* ── Remaining posts ── */}
        {rest.length > 0 && (
          <>
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-5">
              More articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <article className="card-hover h-full overflow-hidden flex flex-col">
                    <div className="overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[1200/630]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverFor(post.slug).replace('.webp', '-600.webp')}
                        alt={`Cover image for the article: ${post.title}`}
                        width={720}
                        height={378}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2.5 text-xs text-slate-400 dark:text-slate-500 mb-3">
                      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      <span aria-hidden>·</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-2.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-1">
                      {post.excerpt}
                    </p>

                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 mt-5">
                      Read article
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* ── CTA ── */}
        <div className="mt-14 relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700" aria-hidden />
          <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden />
          <div className="relative p-8 sm:p-10 text-center text-white">
            <h3 className="text-xl sm:text-2xl font-black mb-3">Put the advice to work</h3>
            <p className="text-blue-100 mb-7 max-w-md mx-auto text-sm leading-relaxed">
              Paste any AI draft into our free humanizer and see the difference for yourself.
            </p>
            <Link
              href="/ai-humanizer"
              className="inline-flex items-center gap-2.5 bg-white text-blue-700 hover:bg-blue-50 font-black py-3.5 px-7 rounded-2xl shadow-card-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Try the AI Humanizer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
