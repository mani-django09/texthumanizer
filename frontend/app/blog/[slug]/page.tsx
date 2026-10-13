import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts, getBlogPost, coverFor } from '@/lib/blogPosts';
import { abs, SITE_NAME } from '@/lib/site';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};

  const ogImg = abs(coverFor(post.slug));

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: abs(`/blog/${post.slug}`),
      type: 'article',
      publishedTime: post.publishedAt,
      images: [{ url: ogImg, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImg],
    },
  };
}

/** Stable, URL-safe anchor id for a heading so the TOC can link to it. */
function slugifyHeading(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    image: abs(coverFor(post.slug)),
    mainEntityOfPage: abs(`/blog/${post.slug}`),
    url: abs(`/blog/${post.slug}`),
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: abs('/icon.svg') } },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: abs('/blog') },
      { '@type': 'ListItem', position: 3, name: post.title, item: abs(`/blog/${post.slug}`) },
    ],
  };

  const headings = post.headings || [];
  const headingMap = new Map(headings.map((h) => [h.after, h.text]));
  const idx = blogPosts.findIndex((p) => p.slug === post.slug);
  const related = [1, 2].map((n) => blogPosts[(idx + n) % blogPosts.length]).filter((p) => p.slug !== post.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

        {/* ── Article header ── */}
        <header className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-700/40">
          <div className="absolute inset-0 aurora opacity-40" aria-hidden />
          <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden />
          <div className="orb w-72 h-72 -top-28 -right-24 bg-blue-400/10 dark:bg-blue-500/10 animate-float" aria-hidden />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-7">
              <Link href="/" className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
              <svg className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/blog" className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</Link>
            </nav>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
              {post.title}
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-7">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 32 32" fill="none">
                    <path d="M21.5 7.5c-4.8 0-9 3.9-10.3 9.3-.3 1.2-.5 2.5-.5 3.8 1.3 0 2.6-.2 3.8-.5 5.4-1.3 9.3-5.5 9.3-10.3 0-.8-.1-1.5-.3-2.3-.7-.2-1.4-.3-2-.3z" fill="#fff" fillOpacity="0.96" />
                  </svg>
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{SITE_NAME}</span>
              </span>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden>·</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </header>

        {/* ── Body + TOC ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">

            <article className="max-w-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverFor(post.slug)}
                alt={`Cover image for the article: ${post.title}`}
                width={1200}
                height={630}
                className="w-full h-auto rounded-2xl border border-slate-200/70 dark:border-slate-700/60 shadow-card-lg mb-10"
              />
              {post.content.map((paragraph, i) => {
                const heading = headingMap.get(i);
                return (
                  <div key={i}>
                    {heading && (
                      <h2
                        id={slugifyHeading(heading)}
                        className="scroll-mt-24 text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-12 mb-4 first:mt-0"
                      >
                        {heading}
                      </h2>
                    )}
                    <p className="text-slate-600 dark:text-slate-300 leading-8 mb-5">{paragraph}</p>
                  </div>
                );
              })}

              {/* ── In-article CTA ── */}
              <div className="mt-14 relative overflow-hidden rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-violet-600 to-purple-700" aria-hidden />
                <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden />
                <div className="relative p-8 sm:p-10 text-center text-white">
                  <h3 className="text-xl sm:text-2xl font-black mb-3">Try the Free AI Humanizer</h3>
                  <p className="text-blue-100 mb-7 max-w-md mx-auto text-sm leading-relaxed">
                    See the difference genuine humanizing makes — paste any AI text and get natural, human-sounding writing back.
                  </p>
                  <Link
                    href="/ai-humanizer"
                    className="inline-flex items-center gap-2.5 bg-white text-blue-700 hover:bg-blue-50 font-black py-3.5 px-7 rounded-2xl shadow-card-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Humanize My Text
                  </Link>
                </div>
              </div>

              {/* ── Related ── */}
              {related.length > 0 && (
                <section className="mt-14">
                  <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-5">
                    Keep reading
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {related.map((r) => (
                      <Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
                        <article className="card-hover h-full p-5">
                          <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">{r.readTime}</p>
                          <h3 className="font-black text-slate-900 dark:text-white leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {r.title}
                          </h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">{r.excerpt}</p>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to all articles
                </Link>
              </div>
            </article>

            {/* ── Sticky table of contents ── */}
            {headings.length > 0 && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                    On this page
                  </p>
                  <nav className="space-y-1 border-l border-slate-200 dark:border-slate-700">
                    {headings.map((h) => (
                      <a
                        key={h.text}
                        href={`#${slugifyHeading(h.text)}`}
                        className="block pl-4 -ml-px border-l-2 border-transparent py-1.5 text-sm text-slate-500 dark:text-slate-400
                                   hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500 transition-colors leading-snug"
                      >
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
