import type { Metadata } from 'next';
import Link from 'next/link';
import { abs, ogImage } from '@/lib/site';

const OG_IMAGE = ogImage('Our Mission & Story', 'About Text Humanizer');

export const metadata: Metadata = {
  title: 'About Text Humanizer – Our Mission & Story',
  description:
    'Learn about Text Humanizer — the free AI writing toolkit helping writers, students and professionals turn AI-generated text into authentic human writing.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Text Humanizer – Our Mission & Story',
    description: 'Learn about Text Humanizer and our mission to bridge AI efficiency with authentic human expression.',
    url: abs('/about'),
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Text Humanizer – Our Mission & Story',
    description: 'Learn about Text Humanizer and our mission to bridge AI efficiency with authentic human expression.',
    images: [OG_IMAGE],
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
    { '@type': 'ListItem', position: 2, name: 'About', item: abs('/about') },
  ],
};

const stats = [
  { value: '4',      label: 'Free writing tools',       icon: '🧰' },
  { value: '5',      label: 'Rewrite styles',           icon: '🎨' },
  { value: '500',    label: 'Free words/request',       icon: '🆓' },
  { value: '$0',     label: 'To start, no card needed',  icon: '🔓' },
];

const values = [
  {
    icon: '🎯',
    grad: 'from-blue-500 to-indigo-600',
    title: 'Quality over quantity',
    desc: 'We add a tool only when we can make it genuinely good. Every humanized output is rewritten for rhythm, vocabulary, and authenticity — not just synonym-swapped.',
  },
  {
    icon: '🔒',
    grad: 'from-violet-500 to-purple-600',
    title: 'Privacy by design',
    desc: 'Your text is processed in real time and discarded immediately. We don\'t log it, store it, or use it to train anything. Privacy isn\'t a policy for us — it\'s how the system is architected.',
  },
  {
    icon: '🆓',
    grad: 'from-emerald-500 to-teal-600',
    title: 'Genuinely free',
    desc: '500 words per request, no account required, no credit card. We keep a real free tier because we believe great writing tools should be accessible to everyone — not just those with a subscription budget.',
  },
  {
    icon: '🤝',
    grad: 'from-amber-500 to-orange-600',
    title: 'Honest about AI',
    desc: 'We\'re not here to help anyone cheat or deceive. Our tool is for legitimate use: polishing AI-assisted drafts, making professional writing sound natural, and helping non-native speakers communicate with confidence.',
  },
];

const tools = [
  {
    href: '/ai-humanizer', name: 'AI Humanizer', tone: 'icon-box-blue',
    desc: 'Rewrites AI drafts for natural rhythm and phrasing, keeping your meaning intact.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
  },
  {
    href: '/grammar-checker', name: 'Grammar Checker', tone: 'icon-box-green',
    desc: 'Fixes spelling, punctuation and agreement errors without touching your style.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    href: '/plagiarism-checker', name: 'Plagiarism Checker', tone: 'icon-box-violet',
    desc: 'Scans sampled sentences against live web results to catch duplicate content.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />,
  },
  {
    href: '/ai-detector', name: 'AI Content Detector', tone: 'icon-box-cyan',
    desc: 'Estimates how AI-like your writing reads, and shows you exactly why.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
  },
];

const team = [
  {
    name: 'Content Marketers',
    icon: '✍️',
    text: 'Who use AI to draft fast and need the output to match their brand voice before publishing.',
  },
  {
    name: 'Students & Researchers',
    icon: '🎓',
    text: 'Who use AI as a research aid and need their final writing to sound genuinely like them.',
  },
  {
    name: 'Business Professionals',
    icon: '💼',
    text: 'Who draft reports, proposals and emails with AI help and need them to land with credibility.',
  },
  {
    name: 'Non-Native English Speakers',
    icon: '🌍',
    text: 'Who use AI for grammar and structure, then humanize so it reads with natural idiom and confidence.',
  },
];

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950">
        <div className="absolute inset-0 aurora opacity-60" aria-hidden />
        <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden />
        <div className="orb w-96 h-96 -top-32 -right-32 bg-blue-400/15 dark:bg-blue-500/15 animate-float" aria-hidden />
        <div className="orb w-72 h-72 -bottom-20 -left-20 bg-violet-400/15 dark:bg-violet-500/15 animate-float-delayed" aria-hidden />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-8">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Home</Link>
            <svg className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
            <span className="text-slate-900 dark:text-white font-semibold">About</span>
          </nav>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] mb-6">
            We believe AI should make you{' '}
            <span className="gradient-text-animated">a better writer</span>,
            not sound like one
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
            Text Humanizer was built on a simple frustration: AI writing tools are incredibly useful, but their output almost always sounds like it came from a machine. We built the fix.
          </p>
          <Link href="/ai-humanizer" className="btn-primary-lg gap-2.5 shadow-glow-md btn-glow">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Try It Free
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="card-gradient-border">
              <div className="bg-white dark:bg-slate-900 rounded-[calc(1rem-1.5px)] p-5 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl sm:text-3xl font-black gradient-text mb-0.5">{s.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tools ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="badge-green inline-flex mb-4">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              What we&apos;ve built
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              Four tools, one purpose
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Everything here exists to help you publish writing you&apos;re confident in. All free, no account required.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {tools.map((t) => (
              <Link key={t.href} href={t.href} className="group block">
                <div className="card-hover h-full p-6 flex gap-4">
                  <div className={`${t.tone} w-11 h-11 rounded-xl flex-shrink-0`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{t.icon}</svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {t.name}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="badge-violet inline-flex mb-5">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
            Why we built this
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            The problem we're solving
          </h2>
          <div className="space-y-5 text-slate-600 dark:text-slate-300 leading-8 text-lg">
            <p>
              AI writing tools have fundamentally changed how people work. They help you start faster, break through writer's block, and produce a solid first draft in minutes. That's genuinely useful. But the output has a tell — a flat, even, over-polished quality that readers immediately recognise as machine-generated.
            </p>
            <p>
              The problem isn't that AI writing is wrong. It's that it's <em>too right</em> — every sentence correctly structured, every paragraph methodically organised, every word choice statistically safe. Real human writing has variation, personality, the occasional short punch of a sentence. AI misses all of that.
            </p>
            <p>
              Text Humanizer rewrites your AI drafts so they sound like you actually wrote them. We don't swap synonyms or shuffle sentences. We rewrite for burstiness, for natural rhythm, for the kind of idiomatic phrasing that only shows up in writing made by people who think in language.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="badge-blue inline-flex mb-4">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              What we stand for
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Our values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map(v => (
              <div key={v.title} className="bento p-7 group">
                <div className="relative inline-flex mb-5">
                  <span className={`absolute inset-0 bg-gradient-to-br ${v.grad} blur-md opacity-40 group-hover:opacity-70 transition-opacity`} aria-hidden />
                  <span className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${v.grad} flex items-center justify-center text-2xl ring-1 ring-white/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                    {v.icon}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{v.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="badge-green inline-flex mb-4">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Our users
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Built for anyone who writes with AI
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {team.map(t => (
              <div key={t.name} className="card-hover p-6 flex gap-4">
                <span className="text-3xl flex-shrink-0">{t.icon}</span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white mb-1">{t.name}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-700" aria-hidden />
        <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden />
        <div className="orb w-64 h-64 -top-16 -right-16 bg-white/10 animate-float" aria-hidden />
        <div className="orb w-48 h-48 -bottom-12 -left-12 bg-white/10 animate-float-delayed" aria-hidden />

        <div className="relative max-w-2xl mx-auto text-center text-white">
          <div className="text-5xl mb-5">🚀</div>
          <h2 className="text-3xl sm:text-4xl font-black mb-5 leading-tight">
            Ready to sound more human?
          </h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Paste your AI-generated text and get back natural, authentic human writing in under 15 seconds. Free, no signup required.
          </p>
          <Link href="/ai-humanizer"
            className="inline-flex items-center gap-3 bg-white text-blue-700 hover:bg-blue-50 font-black py-4 px-9 rounded-2xl shadow-card-xl hover:shadow-glow-sm transition-all duration-300 hover:-translate-y-1 text-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Humanize Text — Free
          </Link>
          <p className="mt-4 text-blue-200 text-sm">No account · 500 words free · Results in under 15s</p>
        </div>
      </section>
    </>
  );
}
