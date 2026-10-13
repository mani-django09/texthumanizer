import type { Metadata } from 'next';
import Link from 'next/link';
import PlagiarismChecker from '@/components/PlagiarismChecker';
import FAQ, { FAQItem } from '@/components/FAQ';
import { PlagiarismIllustration } from '@/components/ToolIllustrations';
import { abs, ogImage } from '@/lib/site';

const OG_IMAGE = ogImage('Scan Text for Web Matches', 'Free Plagiarism Checker');

export const metadata: Metadata = {
  title: 'Free Plagiarism Checker – Scan Text for Web Matches',
  description:
    'Free online plagiarism checker. Scan your text against live web search results to catch duplicate or copied content. No signup required.',
  alternates: { canonical: '/plagiarism-checker' },
  openGraph: {
    title: 'Free Plagiarism Checker – Scan Text for Web Matches',
    description: 'Scan your text against live web results to catch duplicate content. Free, no signup.',
    url: abs('/plagiarism-checker'),
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Plagiarism Checker – Scan Text for Web Matches',
    description: 'Scan your text against live web results to catch duplicate content. Free, no signup.',
    images: [OG_IMAGE],
  },
};

const toolSchema = {
  '@context': 'https://schema.org', '@type': 'WebApplication',
  name: 'Plagiarism Checker', url: abs('/plagiarism-checker'),
  applicationCategory: 'WritingApplication', operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free tool to scan text against live web search results for matching or duplicate content.',
};

const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
    { '@type': 'ListItem', position: 2, name: 'Plagiarism Checker', item: abs('/plagiarism-checker') },
  ],
};

const howItWorks = [
  { step: '1', title: 'Paste your text', text: 'Drop in an essay, article, or any draft you want to double-check before publishing or submitting.' },
  { step: '2', title: 'We sample sentences', text: 'A spread of sentences across your text is selected and searched as exact phrases on the live web.' },
  { step: '3', title: 'Matches get flagged', text: 'Any sentence with a strong web match is highlighted with a link to the source, so you can review it yourself.' },
];

const useCases = [
  { emoji: '🎓', role: 'Students', text: 'Sanity-check an essay before submission to catch accidental overlap with a source you paraphrased too closely.' },
  { emoji: '✍️', role: 'Writers & Bloggers', text: 'Confirm a piece is original before it goes live, especially when working with multiple drafts or contributors.' },
  { emoji: '🧑‍💼', role: 'Freelancers', text: 'Give clients confidence that delivered work is your own, with a quick receipt-style scan.' },
  { emoji: '📋', role: 'Editors', text: 'Spot-check submissions for obvious lifted passages before a deeper editorial review.' },
];

const faqs: FAQItem[] = [
  { question: 'How does this plagiarism checker work?',
    answer: 'We sample sentences from your text and search for each one as an exact phrase on the live web. If a sentence returns a strong match, we flag it and link to the source so you can review it yourself.' },
  { question: 'Is this as thorough as paid tools like Turnitin or Copyscape?',
    answer: 'No — this is a quick web-match scan, not an exhaustive database search. Paid tools compare against massive indexed databases of academic papers, books, and websites. We check a sample of your sentences against live search results, which catches obvious copying but is not a substitute for institutional-grade plagiarism detection.' },
  { question: 'Why are only some sentences checked?',
    answer: 'To keep this tool free, we sample a handful of sentences spread across your text rather than checking every single one — this conserves search capacity while still giving you a useful signal.' },
  { question: 'Is it free?',
    answer: 'Yes — up to 500 words per check, with or without an account. Paid plans allow larger checks.' },
  { question: 'Does it store my text?',
    answer: 'No. Text is processed in real time for the scan and is not stored afterward.' },
];

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
};

export default function PlagiarismCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}/>

      <div id="top" className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="relative overflow-hidden border-b border-slate-200/60 dark:border-slate-700/40">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-400/8 dark:bg-violet-500/8 rounded-full blur-3xl pointer-events-none animate-float"/>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-400/8 dark:bg-purple-500/8 rounded-full blur-3xl pointer-events-none animate-float-delayed"/>
          <div className="absolute inset-0 aurora opacity-60" aria-hidden/>
          <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden/>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-12 sm:pb-14 text-center">
            <h1 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white mb-5 leading-[1.05] tracking-tight">
              Free Plagiarism <span className="gradient-text-animated">Checker</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-7">
              Scan your text against{' '}
              <span className="gradient-text font-semibold">live web search results</span>{' '}
              to catch duplicate or copied content. Up to 500 words — completely free.
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                <li className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-card">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  Live web matching
                </li>
                <li className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-card">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  Links to sources
                </li>
                <li className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-card">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  Originality score
                </li>
                <li className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-card">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  No signup
                </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <PlagiarismChecker/>
        </div>

        {/* ════════════════════════════════════════════
            RICH CONTENT
        ════════════════════════════════════════════ */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center mb-4">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              <div className="badge-violet inline-flex mb-4 not-prose">
                <span className="w-1.5 h-1.5 bg-violet-500 rounded-full"/>
                The short version
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                A quick reality check before you hit publish
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-8">
                Whether it&apos;s a paraphrase that landed too close to the source, or a paragraph you forgot
                you copied months ago, duplicate content has a way of sneaking into drafts. This tool takes
                a sample of your sentences, checks them against what&apos;s actually live on the web right now,
                and shows you exactly which ones came back with a match — and where.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-8">
                It&apos;s built to be a fast sanity check, not a forensic audit. Think of it as the same
                gut-check a careful editor would run before publishing, compressed into a few seconds.
              </p>
            </article>
            <div className="card-premium rounded-2xl p-6">
              <PlagiarismIllustration/>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              How the scan works
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-8 mb-6">
              Three simple steps, no account required.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {howItWorks.map((s) => (
                <div key={s.step} className="card-hover p-5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-black flex items-center justify-center text-sm mb-3">
                    {s.step}
                  </div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm mb-1.5">{s.title}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="badge-green inline-flex mb-3">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"/>
              Who it&apos;s for
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              A fast check before something goes out the door
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {useCases.map((a) => (
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
                One honest note before you rely on this
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-8 mb-6">
                This is a live web-match scan on a sample of sentences — not a search against the massive
                indexed databases that institutional tools like Turnitin use. It will catch obvious, direct
                overlap with public web content. It won&apos;t catch everything a paid academic tool would.
                Use it as a first pass, not a final verdict.
              </p>
              <Link href="#top" className="btn-primary gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Check for Plagiarism Now
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
