import type { Metadata } from 'next';
import Link from 'next/link';
import FAQ, { FAQItem } from '@/components/FAQ';
import HumanizerTool from '@/components/HumanizerTool';
import { SITE_URL } from '@/lib/site';
import Shot from '@/components/Shot';
import { Reveal } from '@/components/Motion';

export const metadata: Metadata = {
  title: 'AI Humanizer – Free AI to Human Text Converter',
  description:
    'Turn AI-generated text into natural human writing instantly. Free AI humanizer, grammar checker, plagiarism checker and AI detector. No signup required.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'AI Humanizer – Free AI to Human Text Converter',
    description: 'Turn AI text into natural human writing instantly. Free, no signup.',
    url: SITE_URL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Humanizer – Free AI to Human Text Converter',
    description: 'Turn AI text into natural human writing in seconds. Free, no signup.',
  },
};

/* ── Icon set (custom line icons, currentColor) ────────────── */
const ICONS: Record<string, React.ReactNode> = {
  bolt:    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>,
  shield:  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 8.2-7 9-4-.8-7-4.5-7-9V6l7-3z M9 12l2 2 4-4"/>,
  feather: <path strokeLinecap="round" strokeLinejoin="round" d="M20 4C12 4 6 9 6 16v2m0 0l-2 2m2-2h2c7 0 12-6 12-14M14 8l-6 6"/>,
  copy:    <path strokeLinecap="round" strokeLinejoin="round" d="M8 8V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2M6 8h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2z"/>,
  gauge:   <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a8 8 0 1114 0M12 13l3.5-3.5M12 13a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>,
  lock:    <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V8a5 5 0 0110 0v3m-9 0h8a2 2 0 012 2v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5a2 2 0 012-2z"/>,
  paste:   <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9h6m-6 4h4"/>,
  wand:    <path strokeLinecap="round" strokeLinejoin="round" d="M5 19l9-9m0 0l1.5-3.5L19 5l-1.5 3.5L14 10zm0 0l3 3M6 5l.7 1.6L8.3 7l-1.6.7L6 9.3 5.3 7.7 3.7 7l1.6-.4L6 5zm12 8l.5 1.2 1.3.4-1.3.5-.5 1.2-.5-1.2-1.3-.5 1.3-.4.5-1.2z"/>,
  check:   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.5l2 2 4.5-4.5M12 3a9 9 0 100 18 9 9 0 000-18z"/>,
  spell:   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>,
  search:  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z"/>,
  radar:   <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>,
};

const SvgIcon = ({ name, className = 'w-6 h-6' }: { name: string; className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
    {ICONS[name]}
  </svg>
);

/* ── The four tools ────────────────────────── */
const tools = [
  {
    href: '/ai-humanizer', icon: 'bolt', name: 'AI Humanizer', tag: 'Most popular',
    grad: 'from-blue-500 to-violet-600', ring: 'group-hover:border-blue-300 dark:group-hover:border-blue-700',
    desc: 'Rewrites AI drafts for natural rhythm and phrasing — same meaning, human voice.',
    bullets: ['5 rewrite styles', 'Before/after diff', 'Human Score estimate'],
  },
  {
    href: '/grammar-checker', icon: 'spell', name: 'Grammar Checker', tag: null,
    grad: 'from-emerald-500 to-teal-600', ring: 'group-hover:border-emerald-300 dark:group-hover:border-emerald-700',
    desc: 'Fixes spelling, punctuation and agreement errors without touching your style.',
    bullets: ['Errors only, no rewrite', 'Highlighted corrections', 'Keeps your voice'],
  },
  {
    href: '/plagiarism-checker', icon: 'search', name: 'Plagiarism Checker', tag: null,
    grad: 'from-violet-500 to-purple-600', ring: 'group-hover:border-violet-300 dark:group-hover:border-violet-700',
    desc: 'Scans sampled sentences against live web results to catch duplicate content.',
    bullets: ['Live web matching', 'Links to sources', 'Originality score'],
  },
  {
    href: '/ai-detector', icon: 'radar', name: 'AI Content Detector', tag: 'New',
    grad: 'from-cyan-500 to-blue-600', ring: 'group-hover:border-cyan-300 dark:group-hover:border-cyan-700',
    desc: 'Estimates how AI-like your writing reads — and shows you exactly which sentences and why.',
    bullets: ['Sentence-level flags', 'Explains every signal', 'Instant result'],
  },
];

/* ── Data ────────────────────────────────── */
const features = [
  { icon: 'bolt',    grad: 'from-blue-500 to-cyan-500',     glow: 'shadow-[0_8px_30px_-6px_rgba(59,130,246,0.6)]',  title: 'Instant Results',    desc: 'Transform AI text into natural human writing in under 15 seconds. No queues, no delays.' },
  { icon: 'feather', grad: 'from-cyan-500 to-teal-500',     glow: 'shadow-[0_8px_30px_-6px_rgba(20,184,166,0.6)]',  title: 'Natural Language',   desc: 'Varied sentence structures, authentic phrasing, and natural flow — just like a skilled human.' },
  { icon: 'copy',    grad: 'from-emerald-500 to-green-600', glow: 'shadow-[0_8px_30px_-6px_rgba(16,185,129,0.6)]',  title: 'Copy & Download',    desc: 'One-click copy to clipboard or download as a .txt file, ready for immediate use.' },
  { icon: 'gauge',   grad: 'from-amber-500 to-orange-600',  glow: 'shadow-[0_8px_30px_-6px_rgba(245,158,11,0.6)]',  title: 'Live Word Counter',  desc: 'Real-time word count with progress bar so you always know exactly where you stand.' },
  { icon: 'lock',    grad: 'from-rose-500 to-pink-600',     glow: 'shadow-[0_8px_30px_-6px_rgba(244,63,94,0.6)]',   title: 'Privacy Guaranteed', desc: 'Guest text is processed and discarded instantly — never stored, never used for training.' },
];

const steps = [
  { n: '01', icon: 'paste', grad: 'from-blue-500 to-indigo-600',  title: 'Paste AI Text',  desc: 'Copy any AI-generated text from ChatGPT, Claude, Gemini, or any other AI tool and paste it in.' },
  { n: '02', icon: 'wand',  grad: 'from-violet-500 to-purple-600', title: 'Click Humanize', desc: 'Hit the button and our engine rewrites your text to sound naturally human.' },
  { n: '03', icon: 'check', grad: 'from-emerald-500 to-teal-600',  title: 'Copy & Use',     desc: 'Your humanized text is ready in seconds. Copy to clipboard or download as a file instantly.' },
];

/* Verifiable facts about the product — no invented traction numbers. */
const stats = [
  { value: '4',      label: 'Free writing tools', icon: '🧰' },
  { value: '500',    label: 'Words free, no account', icon: '🆓' },
  { value: '$0',     label: 'To start, no card needed', icon: '🔓' },
  { value: '<15s',   label: 'Typical processing time', icon: '⚡' },
];

const supportedAI = ['ChatGPT', 'Claude', 'Gemini', 'Copilot', 'GPT-4o', 'Jasper', 'Perplexity', 'Writesonic', 'Bard', 'DeepSeek'];

/* What we actually commit to — stated as principles, not invented reviews. */
const principles = [
  {
    icon: '🔒', grad: 'from-blue-500 to-indigo-600',
    title: 'Your text isn\'t our product',
    desc: 'Guest text is processed in real time and discarded — never stored, never sold, never used to train a model. Signed in, your history is yours alone and you can delete any entry.',
  },
  {
    icon: '🎯', grad: 'from-violet-500 to-purple-600',
    title: 'No dark patterns',
    desc: 'No credit card to try it, no trial that quietly bills you, no watermark on your output. The free tier is a real tier, not a demo.',
  },
  {
    icon: '🤝', grad: 'from-emerald-500 to-teal-600',
    title: 'Honest about limits',
    desc: 'Our Human Score and AI Detector are our own heuristics, not licensed detection models — and we say so on the page instead of implying certainty we don\'t have.',
  },
];

const faqs: FAQItem[] = [
  { question: 'What is an AI Humanizer?',
    answer: 'An AI Humanizer is a tool that rewrites AI-generated text to sound natural and authentically human. It removes robotic patterns, varies sentence structures, and adds genuine-sounding phrasing that AI models miss.' },
  { question: 'Is this tool completely free?',
    answer: 'Yes. Our free tier supports up to 500 words per request and 5,000 words per month with no account required. A free account adds saved history and usage tracking, and paid plans raise the limit. No credit card to start.' },
  { question: 'What other tools do you offer?',
    answer: 'Alongside the AI Humanizer we have a Grammar Checker (fixes errors without changing your style), a Plagiarism Checker (scans sampled sentences against live web results), and an AI Content Detector (estimates how AI-like your writing reads). All are free and need no account.' },
  { question: 'Which AI tools does this work with?',
    answer: 'Works with text from any AI tool — ChatGPT, Claude, Gemini, Copilot, Jasper, Writesonic, Bard, and any other AI writing model. If it was written by AI, we can make it sound human.' },
  { question: 'Will the meaning of my text change?',
    answer: 'No. Our system preserves all original meaning, facts, and intent. Only the writing style changes — making it flow more naturally without altering the substance of what you wrote.' },
  { question: 'How is the output different from my original text?',
    answer: 'The humanizer varies sentence length, replaces stock AI phrases with plainer wording and smooths transitions so the text reads like a person wrote it — while keeping your meaning. Schools, employers and publishers set their own rules on AI-assisted writing, so check the policy that applies to you before you submit or publish.' },
  { question: 'Is my text stored or shared?',
    answer: 'Guest text is never stored — it is processed and discarded immediately. If you are signed in, your requests are saved to your private history so you can revisit them, and you can delete any entry at any time.' },
];

const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
  ],
};

const softwareSchema = {
  '@context': 'https://schema.org', '@type': 'SoftwareApplication',
  name: 'AI Humanizer', applicationCategory: 'WritingApplication', operatingSystem: 'Web',
  url: SITE_URL,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question', name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}/>

      {/* ══════════════════════════════════════════
          HERO — ultra premium
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-white dark:bg-slate-950">
        <div className="absolute inset-0 aurora opacity-90" aria-hidden/>
        <div className="absolute inset-0 grid-pattern opacity-[0.5]" aria-hidden/>
        <div className="orb w-[620px] h-[620px] -top-56 -right-40 bg-blue-400/15 dark:bg-blue-500/15 animate-float" aria-hidden/>
        <div className="orb w-[520px] h-[520px] -bottom-44 -left-44 bg-violet-400/15 dark:bg-violet-500/15 animate-float-delayed" aria-hidden/>

        <div className="relative container-max section-padding pt-16 sm:pt-20">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">

            {/* ── Left: copy ── */}
            <div className="text-center lg:text-left">
              <h1 className="text-[2.7rem] leading-[1.05] sm:text-6xl lg:text-[4.1rem] font-black text-slate-900 dark:text-white tracking-tight mb-6">
                Make AI Writing{' '}
                <span className="gradient-text-animated">Sound Human</span>{' '}
                <span className="inline-block">in Seconds</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
                Paste robotic AI text and get back{' '}
                <strong className="font-semibold text-slate-800 dark:text-slate-100">authentic, natural prose</strong>.
                Then check the grammar, scan for plagiarism, and see how AI-like it reads — all free, all in one place.
              </p>

              {/* Tool pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8">
                {tools.map((t) => (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full
                               bg-white/70 dark:bg-slate-900/60 backdrop-blur-md
                               border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300
                               hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400
                               hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${t.grad}`}/>
                    {t.name}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-9">
                <Link href="#humanizer" className="btn-primary-lg gap-2.5 shadow-glow-md btn-glow text-base w-full sm:w-auto">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Humanize Text — Free
                </Link>
                <Link href="#tools" className="btn-secondary text-base py-4 px-7 w-full sm:w-auto">
                  Explore All Tools
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </Link>
              </div>

              {/* Trust row — factual */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2.5 text-sm text-slate-500 dark:text-slate-400">
                {[
                  { icon: '🆓', text: 'Free — no card' },
                  { icon: '⚡', text: 'Results in seconds' },
                  { icon: '🔒', text: 'Guest text never stored' },
                ].map((b) => (
                  <span key={b.text} className="inline-flex items-center gap-1.5 font-medium">
                    <span>{b.icon}</span> {b.text}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Right: glass tool preview ── */}
            <div className="relative">
              <div className="orb w-72 h-72 top-10 right-6 bg-violet-400/20 dark:bg-violet-500/20 animate-float-slow" aria-hidden/>
              <div className="glow-ring">
                <div className="glass-card p-5 sm:p-6">
                  {/* window chrome */}
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-3 h-3 rounded-full bg-red-400"/>
                    <span className="w-3 h-3 rounded-full bg-amber-400"/>
                    <span className="w-3 h-3 rounded-full bg-emerald-400"/>
                    <span className="ml-auto text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">AI Humanizer</span>
                  </div>

                  {/* before */}
                  <div className="rounded-2xl border border-red-200/70 dark:border-red-900/50 bg-red-50/60 dark:bg-red-950/20 p-4 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-red-500">AI Input</span>
                      <span className="text-[11px] font-bold text-red-500">Reads AI-like</span>
                    </div>
                    <p className="text-[13px] leading-6 text-slate-600 dark:text-slate-300">
                      <mark className="bg-red-200/60 dark:bg-red-500/20 text-red-700 dark:text-red-300 rounded px-1">It is important to note that</mark> AI has revolutionized industries. <mark className="bg-red-200/60 dark:bg-red-500/20 text-red-700 dark:text-red-300 rounded px-1">Furthermore,</mark> it will continue to <mark className="bg-red-200/60 dark:bg-red-500/20 text-red-700 dark:text-red-300 rounded px-1">delve into</mark> new domains.
                    </p>
                  </div>

                  {/* arrow */}
                  <div className="flex justify-center -my-1 relative z-10">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-glow-sm">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
                    </div>
                  </div>

                  {/* after */}
                  <div className="rounded-2xl border border-emerald-200/70 dark:border-emerald-800/50 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Humanized</span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                        Reads human
                      </span>
                    </div>
                    <p className="text-[13px] leading-6 text-slate-700 dark:text-slate-200">
                      AI has quietly reshaped industries we once thought were untouchable — and it&apos;s nowhere near done. The next wave is already here.
                    </p>
                  </div>

                  {/* score bar */}
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 w-20">Human Score</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"/>
                    </div>
                    <span className="text-xs font-black text-emerald-600">88</span>
                  </div>
                  <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 text-center">
                    Illustrative example · Human Score is our own estimate
                  </p>
                </div>
              </div>

              {/* floating chips */}
              <div className="hidden sm:flex absolute -left-4 top-6 items-center gap-2 glass-card !rounded-2xl px-3 py-2 shadow-card-lg animate-float">
                <span className="text-lg">🔒</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Text never stored</span>
              </div>
              <div className="hidden sm:flex absolute -right-3 -bottom-5 items-center gap-2 glass-card !rounded-2xl px-3 py-2 shadow-card-lg animate-float-delayed">
                <span className="text-lg">⚡</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Under 15 seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Logo marquee ── */}
        <div className="relative border-y border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm py-6 mt-6">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">
            Works with every major AI writing tool
          </p>
          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track gap-4">
              {[...supportedAI, ...supportedAI].map((tool, i) => (
                <span key={i} className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-sm font-semibold border border-slate-200 dark:border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500"/>
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TOOL SUITE — the four tools
      ══════════════════════════════════════════ */}
      <section id="tools" className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-25" aria-hidden/>
        <div className="orb w-96 h-96 top-0 right-0 bg-violet-400/8 dark:bg-violet-500/8 animate-float-slow" aria-hidden/>

        <div className="container-max relative">
          <div className="text-center mb-14">
            <div className="badge-violet inline-flex mb-4">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse"/>
              The complete toolkit
            </div>
            <h2 className="section-heading mb-5">
              Four Tools.{' '}
              <span className="gradient-text">One Workflow.</span>
            </h2>
            <p className="section-sub">
              Write with AI, then humanize it, check it, and verify it — without paying for four different subscriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {tools.map((t) => (
              <Link key={t.href} href={t.href} className="group block">
                <article className={`bento h-full p-7 sm:p-8 border-2 border-transparent ${t.ring}`}>
                  <div className="absolute inset-0 aurora opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" aria-hidden/>

                  <div className="relative flex items-start gap-5">
                    <div className="relative flex-shrink-0">
                      <span className={`absolute inset-0 bg-gradient-to-br ${t.grad} blur-lg opacity-40 group-hover:opacity-70 transition-opacity`} aria-hidden/>
                      <span className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${t.grad} flex items-center justify-center text-white ring-1 ring-white/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                        <SvgIcon name={t.icon} className="w-7 h-7"/>
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 mb-2 flex-wrap">
                        <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">{t.name}</h3>
                        {t.tag && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                            {t.tag}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">{t.desc}</p>

                      <ul className="space-y-1.5 mb-5">
                        {t.bullets.map((b) => (
                          <li key={b} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                            {b}
                          </li>
                        ))}
                      </ul>

                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400">
                        Open tool
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HUMANIZE AI TEXT CONVERTER — embedded tool
      ══════════════════════════════════════════ */}
      <section id="humanizer" className="relative overflow-hidden section-padding bg-slate-50/70 dark:bg-slate-900/40">
        <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden/>
        <div className="orb w-80 h-80 top-0 left-1/2 -translate-x-1/2 bg-blue-400/10 dark:bg-blue-500/10 animate-float-slow" aria-hidden/>

        <div className="relative container-max">
          <div className="text-center mb-10">
            <div className="badge-blue inline-flex mb-4">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"/>
              Try It Right Now
            </div>
            <h2 className="section-heading mb-4">
              Humanize AI Text <span className="gradient-text">Converter</span>
            </h2>
            <p className="section-sub">
              Paste your AI-generated text below and see it transform into natural human writing — free, instant, no signup.
            </p>
          </div>

          <HumanizerTool/>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          REAL OUTPUT — screenshots
      ══════════════════════════════════════════ */}
      <section className="section-padding relative overflow-hidden">
        <div className="orb w-96 h-96 -top-20 -left-24 bg-blue-400/8 dark:bg-blue-500/8 animate-float-slow" aria-hidden/>
        <div className="container-max relative">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">
            <Reveal className="lg:col-span-2">
              <div className="badge-green inline-flex mb-4">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"/>
                Real output
              </div>
              <h2 className="section-heading mb-5">
                See exactly <span className="gradient-text">what changed</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-7">
                No black box. Every rewrite comes with a word-by-word view of what was removed and added, so you stay in control of your own text.
              </p>
              <ul className="space-y-3.5">
                {[
                  'Removed phrases struck through, new wording highlighted',
                  'A before/after Human Score on every rewrite',
                  'Tap any sentence to rewrite just that one',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                    <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120} className="lg:col-span-3">
              <Shot
                name="humanizer-diff" width={1280} height={855}
                alt="Text Humanizer Changes view: an AI-written paragraph beside its rewrite, with removed phrases struck through in red and new wording highlighted in green"
                caption="Unedited screenshot of the tool running on its sample text."
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pt-14">
        <div className="container-max grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map(s => (
            <div key={s.label} className="card-gradient-border">
              <div className="bg-white dark:bg-slate-900 rounded-[calc(1rem-1.5px)] p-6 text-center">
                <div className="text-2xl mb-1.5">{s.icon}</div>
                <div className="text-3xl sm:text-4xl font-black gradient-text mb-1">{s.value}</div>
                <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES — bento
      ══════════════════════════════════════════ */}
      <section id="features" className="section-padding">
        <div className="container-max">
          <div className="text-center mb-14">
            <div className="badge-blue inline-flex mb-4">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"/>
              Why AI Humanizer
            </div>
            <h2 className="section-heading mb-5">
              Everything You Need to{' '}
              <span className="gradient-text">Sound Authentically Human</span>
            </h2>
            <p className="section-sub">
              Powerful features that bridge the gap between AI efficiency and genuine human expression.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-fr gap-5">
            {/* Big highlight tile */}
            <div className="bento md:col-span-2 md:row-span-2 p-8 sm:p-10 flex flex-col justify-between group">
              <div className="absolute inset-0 aurora opacity-50 pointer-events-none" aria-hidden/>
              <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" aria-hidden/>
              {/* corner glow */}
              <div className="absolute -top-16 -right-16 w-52 h-52 bg-violet-500/20 blur-3xl rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden/>
              <div className="relative">
                <div className="relative inline-flex mb-6">
                  <span className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 blur-lg opacity-50 group-hover:opacity-80 transition-opacity" aria-hidden/>
                  <span className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white ring-1 ring-white/20 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300">
                    <SvgIcon name="shield" className="w-8 h-8"/>
                  </span>
                </div>
                <div className="badge-violet inline-flex mb-3 text-xs">Quality-first engine</div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-3 leading-tight">Built for Writing That Reads Naturally</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
                  Our engine rewrites for more varied <strong className="text-slate-800 dark:text-white">sentence length</strong> and <strong className="text-slate-800 dark:text-white">word choice</strong> — the hallmarks of natural writing. We never use invisible characters or lookalike glyphs, which corrupt your text. The output reads human because it genuinely is better writing.
                </p>
              </div>
              <div className="relative mt-7 flex flex-wrap gap-2">
                {['Varied sentence length','Natural transitions','No AI stock phrases','Meaning preserved','No hidden characters'].map(d => (
                  <span key={d} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {features.map((f) => (
              <div key={f.title} className="bento p-7 group">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden/>
                <div className="relative inline-flex mb-5">
                  <span className={`absolute inset-0 bg-gradient-to-br ${f.grad} blur-md opacity-40 group-hover:opacity-70 transition-opacity`} aria-hidden/>
                  <span className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${f.grad} flex items-center justify-center text-white ring-1 ring-white/20 ${f.glow} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                    <SvgIcon name={f.icon} className="w-7 h-7"/>
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section id="how-it-works" className="section-padding relative overflow-hidden bg-slate-50/70 dark:bg-slate-900/40">
        <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden/>
        <div className="orb w-80 h-80 top-10 left-1/2 -translate-x-1/2 bg-violet-400/10 dark:bg-violet-500/10 animate-float-slow" aria-hidden/>
        <div className="container-max max-w-6xl relative">
          <div className="text-center mb-16">
            <div className="badge-violet inline-flex mb-4">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full"/>
              Simple Process
            </div>
            <h2 className="section-heading mb-4">How It Works</h2>
            <p className="section-sub">Three steps from AI text to authentic human writing.</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
            {/* connector line */}
            <div className="hidden md:block absolute top-[4.5rem] left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-300 via-violet-300 to-emerald-300 dark:from-blue-700 dark:via-violet-700 dark:to-emerald-700" aria-hidden/>

            {steps.map((s) => (
              <div key={s.n} className="group relative bento p-8 text-center flex flex-col items-center pt-10">
                {/* hover sheen */}
                <div className="absolute inset-0 aurora opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" aria-hidden/>

                {/* icon */}
                <div className="relative mb-6">
                  <span className={`absolute inset-0 bg-gradient-to-br ${s.grad} blur-xl opacity-40 group-hover:opacity-70 transition-opacity`} aria-hidden/>
                  <div className={`relative w-20 h-20 rounded-3xl bg-gradient-to-br ${s.grad} flex items-center justify-center text-white ring-1 ring-white/25 shadow-glow-sm group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300`}>
                    <SvgIcon name={s.icon} className="w-9 h-9"/>
                  </div>
                  {/* step number badge */}
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-card-md flex items-center justify-center text-xs font-black text-slate-700 dark:text-slate-200">
                    {s.n}
                  </span>
                </div>

                <h3 className="relative font-bold text-xl text-slate-900 dark:text-white mb-3">{s.title}</h3>
                <p className="relative text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="#humanizer" className="btn-primary-lg gap-2 shadow-glow-md btn-glow">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Start Humanizing for Free
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BEFORE / AFTER
      ══════════════════════════════════════════ */}
      <section className="section-padding relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" aria-hidden/>
        <div className="absolute inset-0 aurora opacity-25" aria-hidden/>
        <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden/>
        <div className="orb w-96 h-96 -top-24 -right-24 bg-blue-500/20 animate-float" aria-hidden/>
        <div className="orb w-80 h-80 -bottom-20 -left-20 bg-violet-500/20 animate-float-delayed" aria-hidden/>

        <div className="container-max relative">
          <div className="text-center mb-12">
            <div className="badge bg-white/10 border-white/20 text-white inline-flex mb-4">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"/>
              Real Example
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
              See the <span className="gradient-text-animated">Difference</span> Instantly
            </h2>
            <p className="text-slate-300 text-lg max-w-xl mx-auto">The same content — before and after humanization.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-3 w-3 rounded-full bg-red-500 ring-4 ring-red-500/20"/>
                <span className="text-white/80 font-semibold text-sm uppercase tracking-wider">AI-Generated Text</span>
                <span className="ml-auto badge bg-red-500/20 border-red-500/30 text-red-300 text-xs py-0.5">Robotic</span>
              </div>
              <p className="text-slate-300 text-sm leading-7">
                <span className="bg-red-500/20 px-1 rounded text-red-300">It is important to note that</span> artificial intelligence has revolutionized numerous industries. <span className="bg-red-500/20 px-1 rounded text-red-300">Furthermore,</span> the advent of large language models has enabled unprecedented capabilities in natural language processing. <span className="bg-red-500/20 px-1 rounded text-red-300">In conclusion,</span> it is evident that AI will continue to <span className="bg-red-500/20 px-1 rounded text-red-300">delve into</span> new domains and reshape the future of work.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-red-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                Uniform rhythm · 4 stock AI phrases
              </div>
            </div>

            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-600 rounded-full items-center justify-center shadow-glow-sm" aria-hidden>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>

            <div className="glass rounded-2xl p-6 border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <span className="flex h-3 w-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"/>
                <span className="text-white/80 font-semibold text-sm uppercase tracking-wider">Humanized Text</span>
                <span className="ml-auto badge bg-emerald-500/20 border-emerald-500/30 text-emerald-300 text-xs py-0.5">Natural</span>
              </div>
              <p className="text-slate-200 text-sm leading-7">
                <span className="bg-emerald-500/15 px-1 rounded text-emerald-200">AI has quietly transformed</span> industries we once thought immune to technological disruption. Large language models, in particular, have unlocked capabilities that felt like science fiction just a decade ago. <span className="bg-emerald-500/15 px-1 rounded text-emerald-200">What&apos;s clear is this:</span> AI isn&apos;t just reshaping the future of work — it&apos;s already doing it, right now, across fields most of us never expected.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Varied rhythm · 0 stock AI phrases
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="#humanizer" className="inline-flex items-center gap-2.5 bg-white text-slate-900 hover:bg-blue-50 font-bold py-4 px-8 rounded-2xl shadow-card-xl hover:shadow-glow-sm transition-all duration-300 hover:-translate-y-1">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Transform My Text Now
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRINCIPLES
      ══════════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <div className="badge-green inline-flex mb-4">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"/>
              How we operate
            </div>
            <h2 className="section-heading mb-5">
              Built the way we&apos;d want{' '}
              <span className="gradient-text">a tool built for us</span>
            </h2>
            <p className="section-sub">
              No invented review counts, no fake urgency — just the commitments we actually hold ourselves to.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {principles.map((p) => (
              <div key={p.title} className="bento p-7 sm:p-8 group">
                <div className="absolute inset-0 aurora opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" aria-hidden/>
                <div className="relative">
                  <div className="relative inline-flex mb-5">
                    <span className={`absolute inset-0 bg-gradient-to-br ${p.grad} blur-lg opacity-40 group-hover:opacity-70 transition-opacity`} aria-hidden/>
                    <span className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${p.grad} flex items-center justify-center text-2xl ring-1 ring-white/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                      {p.icon}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2.5 leading-snug">{p.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════ */}
      <section id="faq" className="section-padding bg-slate-50/70 dark:bg-slate-900/40">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-12">
            <div className="badge-blue inline-flex mb-4">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"/>
              Have Questions?
            </div>
            <h2 className="section-heading mb-4">Frequently Asked Questions</h2>
            <p className="section-sub text-base">Everything you need to know about our tools.</p>
          </div>
          <FAQ items={faqs}/>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════ */}
      <section className="section-padding-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-violet-600 to-purple-700" aria-hidden/>
        <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden/>
        <div className="orb w-64 h-64 -top-16 -right-16 bg-white/10 animate-float" aria-hidden/>
        <div className="orb w-48 h-48 -bottom-12 -left-12 bg-white/10 animate-float-delayed" aria-hidden/>

        <div className="container-max relative text-center text-white max-w-3xl">
          <div className="text-5xl mb-5">🚀</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-5 leading-tight">Ready to Humanize<br/>Your Text?</h2>
          <p className="text-blue-100 text-lg sm:text-xl mb-8 max-w-xl mx-auto leading-relaxed">
            Paste your first draft and see the difference in seconds. No account, no card, no catch.
          </p>
          <Link href="#humanizer" className="inline-flex items-center gap-3 bg-white text-blue-700 hover:bg-blue-50 font-black py-5 px-10 rounded-2xl shadow-card-xl hover:shadow-glow-md transition-all duration-300 hover:-translate-y-1 text-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Humanize Text — Free
          </Link>
          <p className="mt-4 text-blue-200 text-sm">No account required · 500 words free · Instant results</p>
        </div>
      </section>
    </>
  );
}
