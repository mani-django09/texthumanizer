import type { Metadata } from 'next';
import Link from 'next/link';
import AIDetector from '@/components/AIDetector';
import FAQ, { FAQItem } from '@/components/FAQ';
import { AIDetectorIllustration } from '@/components/ToolIllustrations';
import { abs, ogImage } from '@/lib/site';
import Shot from '@/components/Shot';
import { Reveal } from '@/components/Motion';

const OG_IMAGE = ogImage('Check If Text Is AI-Written', 'Free AI Content Detector');

export const metadata: Metadata = {
  title: 'Free AI Content Detector – Check If Text Is AI-Written',
  description:
    'Free AI content detector. Paste any text to estimate how likely it is to be AI-generated, based on sentence variance, common AI phrasing, and word repetition. No signup required.',
  alternates: { canonical: '/ai-detector' },
  openGraph: {
    title: 'Free AI Content Detector – Check If Text Is AI-Written',
    description: 'Estimate how AI-like your text reads — sentence variance, AI phrasing, and repetition checks. Free, no signup.',
    url: abs('/ai-detector'),
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Content Detector – Check If Text Is AI-Written',
    description: 'Estimate how AI-like your text reads — sentence variance, AI phrasing, and repetition checks. Free, no signup.',
    images: [OG_IMAGE],
  },
};

const toolSchema = {
  '@context': 'https://schema.org', '@type': 'WebApplication',
  name: 'AI Content Detector', url: abs('/ai-detector'),
  applicationCategory: 'WritingApplication', operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free tool that estimates how likely text is to be AI-generated using sentence-length variance, AI-signature phrases, and lexical diversity.',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
    { '@type': 'ListItem', position: 2, name: 'AI Content Detector', item: abs('/ai-detector') },
  ],
};

const signals = [
  { emoji: '📏', title: 'Sentence-length variance', text: 'Human writing mixes short punches with longer, winding sentences. AI text tends toward a steady, even rhythm — we measure that "burstiness".' },
  { emoji: '🗣️', title: 'AI-signature phrases', text: 'Stock phrases like "delve into" or "it is important to note" show up far more often in model output than in typical human writing.' },
  { emoji: '🔁', title: 'Word repetition', text: 'Lower lexical diversity — reusing the same words relative to text length — is another common AI fingerprint.' },
];

const compare = [
  { label: 'How it decides', them: 'A trained ML model scores probability from labeled datasets', us: 'A transparent, rule-based heuristic you can read the logic of' },
  { label: 'Cost', them: 'Often paid / limited free checks', us: 'Free, unlimited within the word cap' },
  { label: 'Speed', them: 'A few seconds', us: 'Instant' },
  { label: 'Accuracy claim', them: 'Marketed as highly accurate', us: 'Honestly a rough signal, not proof' },
];

const faqs: FAQItem[] = [
  { question: 'How does this AI detector work?',
    answer: 'We analyze three statistical signals in your text: sentence-length variance ("burstiness" — human writing tends to mix short and long sentences, AI writing tends toward uniform length), common AI-signature phrases (like "it is important to note" or "delve into"), and word repetition (lexical diversity). These combine into a 0-100 score.' },
  { question: 'Is this the same as GPTZero, Originality.ai, or Turnitin\'s AI detector?',
    answer: 'No. Those are trained machine-learning classifiers built on large labeled datasets and licensed models. This tool is our own transparent, rule-based heuristic — it looks at writing patterns, not a trained model\'s prediction. It costs nothing to run and is instant, but it is not as accurate as commercial detectors and should not be used as sole proof of AI authorship.' },
  { question: 'Can this tool be wrong?',
    answer: 'Yes. A human writer with consistent sentence length can score as "likely AI," and AI text edited by a human can score as "likely human." Use this as a quick signal to sanity-check text, not a definitive verdict — no AI detector, including paid ones, is 100% accurate.' },
  { question: 'Is it free?',
    answer: 'Yes — up to 500 words per check, with or without an account. Paid plans allow larger checks.' },
  { question: 'Does it store my text?',
    answer: 'No. Text is analyzed in real time and is not stored afterward unless you are logged in and it is saved to your own history.' },
];

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
};

export default function AIDetectorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}/>

      <div id="top" className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-700/40">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/8 dark:bg-blue-500/8 rounded-full blur-3xl pointer-events-none animate-float"/>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-violet-400/8 dark:bg-violet-500/8 rounded-full blur-3xl pointer-events-none animate-float-delayed"/>
          <div className="absolute inset-0 aurora opacity-60" aria-hidden/>
          <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden/>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-12 sm:pb-14 text-center">
            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white mb-5 leading-[1.05] tracking-tight">
              Free AI Content <span className="gradient-text-animated">Detector</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-7">
              Paste any text to see how{' '}
              <span className="gradient-text font-semibold">AI-generated it reads</span>{' '}
              — based on sentence variance, common AI phrasing, and repetition. Up to 500 words, free.
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                <li className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-card">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  Sentence-by-sentence flags
                </li>
                <li className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-card">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  Explains every signal
                </li>
                <li className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-card">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  Instant result
                </li>
                <li className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-card">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  No signup
                </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <AIDetector/>
        </div>

        {/* ── Real screenshot ── */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-9">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400 mb-3">A real result</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">A verdict you can check</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">You get the score, the three signals behind it, and the exact phrase that flagged each sentence — not just a percentage to take on trust.</p>
            </div>
            <Shot name="detector-verdict" width={1280} height={776} alt="AI Content Detector result showing a 50% human score, a Mixed Signals verdict, three measured signals and two flagged sentences with the phrase that triggered each" caption="Actual output from the sample text on this page. The score is our own estimate, not a third-party detector." />
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
                A transparent signal, not a black-box verdict
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-8">
                Most AI detectors are black boxes — you get a percentage with no explanation of how it was
                reached. This one shows its work. It looks at three measurable writing patterns, the same
                kind of signals researchers point to when they explain how AI text tends to differ from
                human writing, and shows you exactly which sentences tripped which signal.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-8">
                It won&apos;t out-perform a trained detection model built on millions of labeled examples.
                What it will do is give you an instant, explainable, completely free read on your text —
                and tell you honestly when it isn&apos;t sure.
              </p>
            </article>
            <div className="card-premium rounded-2xl p-6">
              <AIDetectorIllustration/>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              The three signals we measure
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-8 mb-6">
              No hidden model, no mystery score — just patterns you can verify yourself.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {signals.map((s) => (
                <div key={s.title} className="card-hover p-5">
                  <span className="text-2xl mb-2 block">{s.emoji}</span>
                  <p className="font-bold text-slate-800 dark:text-white text-sm mb-1.5">{s.title}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="badge-violet inline-flex mb-3">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full"/>
              Us vs. commercial AI detectors
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              What you&apos;re actually getting
            </h2>
          </div>
          <div className="card-premium overflow-hidden rounded-2xl">
            <div className="grid grid-cols-3 text-sm">
              <div className="px-4 sm:px-6 py-4 font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60">What matters</div>
              <div className="px-4 sm:px-6 py-4 font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 text-center">Paid detectors</div>
              <div className="px-4 sm:px-6 py-4 font-black text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30 text-center">This tool</div>
              {compare.map((row, i) => (
                <div key={row.label} className="contents">
                  <div className={`px-4 sm:px-6 py-4 font-semibold text-slate-700 dark:text-slate-200 ${i % 2 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}>{row.label}</div>
                  <div className={`px-4 sm:px-6 py-4 text-slate-500 dark:text-slate-400 text-center ${i % 2 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}>{row.them}</div>
                  <div className={`px-4 sm:px-6 py-4 text-center font-semibold text-emerald-600 dark:text-emerald-400 ${i % 2 ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'bg-blue-50/20 dark:bg-blue-950/10'}`}>
                    {row.us}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative overflow-hidden rounded-3xl card-premium p-7 sm:p-10">
            <div className="absolute inset-0 aurora opacity-40 pointer-events-none" aria-hidden/>
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                One honest note before you trust the score
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-8 mb-6">
                No AI detector — free or paid — is 100% accurate. This one is upfront about being a
                heuristic: it flags patterns statistically associated with AI writing, not a verified
                fingerprint. Use it to sanity-check text, not to make high-stakes accusations about
                someone else&apos;s work.
              </p>
              <Link href="#top" className="btn-primary gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Detect AI Content Now
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
