import type { Metadata } from 'next';
import Link from 'next/link';
import GrammarChecker from '@/components/GrammarChecker';
import FAQ, { FAQItem } from '@/components/FAQ';
import { GrammarIllustration } from '@/components/ToolIllustrations';
import { abs, ogImage } from '@/lib/site';
import Shot from '@/components/Shot';
import { Reveal } from '@/components/Motion';

const OG_IMAGE = ogImage('Fix Grammar & Spelling Instantly', 'Free · No Signup Required');

export const metadata: Metadata = {
  title: 'Free Grammar Checker – Fix Errors Instantly',
  description:
    'Free online grammar checker. Fix spelling, punctuation, and grammar errors instantly without changing your writing style. No signup required.',
  alternates: { canonical: '/grammar-checker' },
  openGraph: {
    title: 'Free Grammar Checker – Fix Errors Instantly',
    description: 'Fix spelling, punctuation, and grammar errors instantly. Free, no signup.',
    url: abs('/grammar-checker'),
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Grammar Checker – Fix Errors Instantly',
    description: 'Fix spelling, punctuation, and grammar errors instantly. Free, no signup.',
    images: [OG_IMAGE],
  },
};

const toolSchema = {
  '@context': 'https://schema.org', '@type': 'WebApplication',
  name: 'Grammar Checker', url: abs('/grammar-checker'),
  applicationCategory: 'WritingApplication', operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free tool to fix grammar, spelling, and punctuation errors without changing writing style.',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
    { '@type': 'ListItem', position: 2, name: 'Grammar Checker', item: abs('/grammar-checker') },
  ],
};

const errorTypes = [
  { emoji: '🔤', title: 'Spelling mistakes', text: 'Typos, missing letters, and commonly confused words like "their/there" or "its/it\'s".' },
  { emoji: '🧩', title: 'Subject-verb agreement', text: '"The team are ready" → "The team is ready" — mismatches that slip past a quick read-through.' },
  { emoji: '✂️', title: 'Punctuation', text: 'Missing commas, stray apostrophes, run-on sentences, and misplaced periods.' },
  { emoji: '🔁', title: 'Word repetition & tense shifts', text: 'Accidentally repeated words and sentences that drift between past and present tense.' },
];

const compare = [
  { label: 'Time to proofread 500 words', manual: '10–20 minutes', tool: 'Under 10 seconds' },
  { label: 'Catches subtle agreement errors', manual: 'Easy to miss', tool: 'Flagged automatically' },
  { label: 'Changes your tone or style', manual: 'Risk if over-edited', tool: 'Never — only fixes errors' },
  { label: 'Consistency across a long document', manual: 'Fatigue sets in', tool: 'Same accuracy throughout' },
  { label: 'Cost', manual: 'Your time', tool: 'Free up to 500 words' },
];

const audiences = [
  { emoji: '📧', role: 'Professionals', text: 'Catch typos in emails, reports, and proposals before they go out — a single error can undercut an otherwise strong message.' },
  { emoji: '🎓', role: 'Students', text: 'Clean up essays and assignments so grammar mistakes never distract from your actual argument or research.' },
  { emoji: '✍️', role: 'Bloggers & Writers', text: 'Proofread drafts fast without a paid subscription, then move straight to publishing.' },
  { emoji: '🌍', role: 'Non-Native Speakers', text: 'Get a second set of eyes on grammar and punctuation so your writing reads clean and confident.' },
];

const faqs: FAQItem[] = [
  { question: 'How is this different from a humanizer?',
    answer: 'The grammar checker only fixes genuine errors — spelling, punctuation, subject-verb agreement — and leaves your style, tone, and phrasing untouched. The humanizer rewrites text to sound more natural, changing sentence structure and word choice.' },
  { question: 'Will it change my writing style?',
    answer: 'No. Correct sentences are left exactly as you wrote them. Only actual errors get fixed, so your voice stays intact.' },
  { question: 'What kinds of errors does it catch?',
    answer: 'Spelling mistakes, punctuation issues, subject-verb agreement, run-on sentences, and awkward tense shifts. It is a grammar and correctness pass, not a style rewrite.' },
  { question: 'Is it free?',
    answer: 'Yes — up to 500 words per check, with or without an account. Paid plans allow larger checks.' },
  { question: 'Does it store my text?',
    answer: 'No. Text is processed in real time and discarded immediately unless you\'re signed in, in which case it\'s saved to your private history.' },
];

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
};

export default function GrammarCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}/>

      <div id="top" className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-700/40">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/8 dark:bg-blue-500/8 rounded-full blur-3xl pointer-events-none animate-float"/>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-400/8 dark:bg-emerald-500/8 rounded-full blur-3xl pointer-events-none animate-float-delayed"/>
          <div className="absolute inset-0 aurora opacity-60" aria-hidden/>
          <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden/>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-12 sm:pb-14 text-center">
            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white mb-5 leading-[1.05] tracking-tight">
              Free Grammar <span className="gradient-text-animated">Checker</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-7">
              Fix spelling, punctuation, and grammar errors instantly —{' '}
              <span className="gradient-text font-semibold">without changing your writing style</span>.
              Up to 500 words — completely free.
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                <li className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-card">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  Spelling & punctuation
                </li>
                <li className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-card">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  Subject–verb agreement
                </li>
                <li className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-card">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  Highlighted corrections
                </li>
                <li className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-card">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  Keeps your style
                </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <GrammarChecker/>
        </div>

        {/* ── Real screenshot ── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-9">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400 mb-3">A real result</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Every fix, shown in place</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">Removed words are struck through in red, corrections appear in green — so you can see exactly what changed and nothing is rewritten behind your back.</p>
            </div>
            <Shot name="grammar-result" width={1280} height={581} alt="Grammar Checker result showing seven highlighted corrections, such as “Their” changed to “There” and “dont” to “don't”" caption="Actual output from the sample text on this page." />
          </Reveal>
        </section>

        {/* ════════════════════════════════════════════
            RICH CONTENT
        ════════════════════════════════════════════ */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center mb-4">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <div className="badge-blue inline-flex mb-4 not-prose">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"/>
                The short version
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Errors fixed. Your voice untouched.
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-8">
                Most grammar tools quietly rewrite your sentences while they&apos;re at it — smoothing tone,
                swapping words, changing rhythm. This one doesn&apos;t. It looks only for genuine mistakes:
                spelling, punctuation, agreement, tense — and fixes exactly those, leaving every correct
                sentence exactly as you wrote it.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-8">
                That distinction matters if you have a voice worth keeping. Paste your draft, get it back
                clean, and nothing about how you write has changed — just the parts that were actually wrong.
              </p>
            </article>
            <div className="card-premium rounded-2xl p-6">
              <GrammarIllustration/>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              What it catches
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-8 mb-6">
              A focused pass over the errors that actually trip up readers — not a style rewrite in disguise.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {errorTypes.map((t) => (
                <div key={t.title} className="card-hover p-5 flex gap-4">
                  <span className="text-2xl flex-shrink-0">{t.emoji}</span>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white text-sm mb-1">{t.title}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{t.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="badge-violet inline-flex mb-3">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full"/>
              Proofreading by hand vs. this tool
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              A second pair of eyes, in ten seconds
            </h2>
          </div>
          <div className="card-premium overflow-hidden rounded-2xl">
            <div className="grid grid-cols-3 text-sm">
              <div className="px-4 sm:px-6 py-4 font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60">What matters</div>
              <div className="px-4 sm:px-6 py-4 font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 text-center">Manually</div>
              <div className="px-4 sm:px-6 py-4 font-black text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30 text-center">Grammar Checker</div>
              {compare.map((row, i) => (
                <div key={row.label} className="contents">
                  <div className={`px-4 sm:px-6 py-4 font-semibold text-slate-700 dark:text-slate-200 ${i % 2 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}>{row.label}</div>
                  <div className={`px-4 sm:px-6 py-4 text-slate-500 dark:text-slate-400 text-center ${i % 2 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}>{row.manual}</div>
                  <div className={`px-4 sm:px-6 py-4 text-center font-semibold text-emerald-600 dark:text-emerald-400 ${i % 2 ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'bg-blue-50/20 dark:bg-blue-950/10'}`}>
                    {row.tool}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="badge-green inline-flex mb-3">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"/>
              Who it&apos;s for
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Built for anyone who hits publish or send
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {audiences.map((a) => (
              <div key={a.role} className="card-hover p-6 flex gap-4">
                <span className="text-3xl flex-shrink-0">{a.emoji}</span>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white mb-1">{a.role}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{a.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative overflow-hidden rounded-3xl card-premium p-7 sm:p-10">
            <div className="absolute inset-0 aurora opacity-40 pointer-events-none" aria-hidden/>
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                One honest note before you go
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-8 mb-6">
                A grammar checker fixes what&apos;s objectively wrong — it can&apos;t tell you if an argument is
                weak or a paragraph is boring. Pair it with your own read-through for content, and let this
                handle the mechanical slips that are easy to miss in your own writing.
              </p>
              <Link href="#top" className="btn-primary gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Check Your Grammar Now
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <FAQ items={faqs}/>
        </div>
      </div>
    </>
  );
}
