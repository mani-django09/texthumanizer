import type { Metadata } from 'next';
import Link from 'next/link';
import HumanizerTool from '@/components/HumanizerTool';
import FAQ, { FAQItem } from '@/components/FAQ';
import { TellsExplorer, StyleShowcase, Tell, StyleSample } from '@/components/HumanizerExplainer';
import { Reveal, RotatingWords } from '@/components/Motion';
import { abs, ogImage } from '@/lib/site';
import Shot from '@/components/Shot';

const OG_IMAGE = ogImage('Convert AI Text to Human Writing', 'Free · No Signup Required');

export const metadata: Metadata = {
  title: 'Free AI Humanizer Tool – Convert AI Text to Human Writing',
  description:
    'Paste AI text and get natural human writing in under 15 seconds. Free AI humanizer with 5 rewrite styles. No signup. Works with ChatGPT, Claude, Gemini & more.',
  alternates: { canonical: '/ai-humanizer' },
  openGraph: {
    title: 'Free AI Humanizer Tool – Convert AI Text to Human Writing',
    description: 'Paste AI text and get natural human writing in under 15 seconds. Free, no signup.',
    url: abs('/ai-humanizer'),
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Humanizer Tool – Convert AI Text to Human Writing',
    description: 'Paste AI text and get natural human writing in under 15 seconds. Free, no signup.',
    images: [OG_IMAGE],
  },
};

const toolSchema = {
  '@context': 'https://schema.org', '@type': 'WebApplication',
  name: 'AI Humanizer Tool', url: abs('/ai-humanizer'),
  applicationCategory: 'WritingApplication', operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free tool that rewrites AI-generated text into natural, human-sounding writing.',
};

const supportedAI = ['ChatGPT', 'Claude', 'Gemini', 'Copilot', 'Bard', 'Jasper', 'Writesonic', 'GPT-4o', 'Perplexity', 'Any AI Tool'];

/* ── Hero feature strip ── */
const heroFeatures = [
  { label: '5 rewrite styles',      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
  { label: 'Before / after diff',   icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { label: 'Human Score estimate',  icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { label: '.txt · .docx · .pdf',   icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
];

/* ── How it works ── */
const steps = [
  { n: '01', title: 'Paste your draft', text: 'Drop in text from ChatGPT, Claude, Gemini or any other tool — or upload a .txt, .docx or .pdf file.', grad: 'from-blue-500 to-indigo-600',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { n: '02', title: 'Pick a style', text: 'Standard, casual, professional, academic or creative — match the voice you actually need.', grad: 'from-violet-500 to-purple-600',
    icon: 'M4 6h16M4 12h16M4 18h7' },
  { n: '03', title: 'Review & copy', text: 'Compare with the diff view, regenerate any sentence you don’t love, then copy or download the result.', grad: 'from-emerald-500 to-teal-600',
    icon: 'M5 13l4 4L19 7' },
];

/* ── The "tells" that give AI writing away — with illustrative before/after ── */
const aiTells: Tell[] = [
  { phrase: '“It is important to note that…”',
    why: 'A throat-clearing filler that real writers almost never reach for. We cut it and get straight to the point.',
    before: 'It is important to note that remote work changes how teams communicate.',
    after: 'Remote work changes how teams communicate.' },
  { phrase: '“Furthermore / Moreover / Additionally”',
    why: 'Stacked formal connectors are a dead giveaway. Humans link ideas more loosely — sometimes with nothing at all.',
    before: 'The tool is fast. Furthermore, it is easy to use. Moreover, it is free.',
    after: 'The tool is fast, easy to use, and free.' },
  { phrase: '“Delve into / Navigate the landscape”',
    why: 'Pet metaphors that models overuse. We swap them for plainer, more specific verbs.',
    before: 'Let’s delve into the landscape of modern marketing.',
    after: 'Let’s look at how marketing works today.' },
  { phrase: 'Every sentence the same length',
    why: 'AI writes in a steady, even rhythm. We add the short punches and longer runs that real people write with.',
    before: 'The report covers sales data. The team reviewed the figures. The results show steady growth. The board approved the plan.',
    after: 'The report covers sales. The team went through the numbers twice, and the trend was clear: steady growth. The board signed off.' },
  { phrase: '“In conclusion, it is evident that…”',
    why: 'Nobody talks like this. We rewrite conclusions so they actually land instead of announcing themselves.',
    before: 'In conclusion, it is evident that consistency drives results.',
    after: 'Consistency drives results. Everything else is detail.' },
  { phrase: 'A tone that never changes',
    why: 'Genuine writing breathes — a little warmth here, a little bite there. We bring that variation back.',
    before: 'The product is efficient. The product is reliable. The product is affordable.',
    after: 'It’s efficient, dependably so, and it won’t stretch your budget.' },
];

/* ── Same sentence, five styles (illustrative) ── */
const styleOriginal =
  'It is important to note that remote work has significantly transformed the way teams communicate and collaborate.';
const styleSamples: StyleSample[] = [
  { id: 'standard',     label: 'Standard',     output: 'Remote work has changed how teams communicate and work together.' },
  { id: 'casual',       label: 'Casual',       output: 'Working remotely has totally changed how teams talk and get things done.' },
  { id: 'professional', label: 'Professional', output: 'Remote work has materially changed how teams communicate and collaborate.' },
  { id: 'academic',     label: 'Academic',     output: 'Remote work has substantially altered patterns of team communication and collaboration.' },
  { id: 'creative',     label: 'Creative',     output: 'Remote work rewired the way teams talk, trade ideas and build things together.' },
];

/* ── Feature bento (all real, shipped features) ── */
const features = [
  { title: 'Five rewrite styles', span: 'md:col-span-2', grad: 'from-blue-500 to-indigo-600',
    text: 'Standard, casual, professional, academic or creative. Your last choice is remembered next time you visit.',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    chips: ['Standard', 'Casual', 'Professional', 'Academic', 'Creative'] },
  { title: 'See exactly what changed', span: '', grad: 'from-emerald-500 to-teal-600',
    text: 'A word-level diff shows what was removed and added, plus how much of the text was reworded.',
    icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { title: 'Before & after Human Score', span: '', grad: 'from-violet-500 to-purple-600',
    text: 'Our own free, instant estimate of how human the writing reads — a quick signal, not a third-party detector.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { title: 'Fix one sentence at a time', span: 'md:col-span-2', grad: 'from-rose-500 to-orange-500',
    text: 'Like most of the rewrite but not one line? Tap it and rewrite just that sentence — the rest stays put.',
    icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { title: 'Upload documents', span: '', grad: 'from-cyan-500 to-blue-600',
    text: 'Bring a .txt, .docx or .pdf straight in — no copy-paste from a file first.',
    icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12' },
  { title: 'Private by default', span: 'md:col-span-2', grad: 'from-slate-600 to-slate-800',
    text: 'Guest text is processed and discarded — never stored. Signed in, your history is yours alone and you can delete any entry.',
    icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
];

/* ── Manual vs. our tool ── */
const compare = [
  { label: 'Time per 500 words', manual: '30–45 minutes', tool: 'Under 15 seconds' },
  { label: 'Sentence-rhythm variation', manual: 'Depends on your skill', tool: 'Handled automatically' },
  { label: 'Removes AI signature phrases', manual: 'Easy to miss a few', tool: 'Caught every pass' },
  { label: 'Keeps your meaning intact', manual: 'Yes, if you’re careful', tool: 'Yes, by design' },
  { label: 'Consistent across long drafts', manual: 'Hard to keep up', tool: 'Same quality throughout' },
  { label: 'Cost', manual: 'Your hours', tool: 'Free up to 500 words' },
];

/* ── Who it helps ── */
const audiences = [
  { emoji: '✍️', role: 'Content & SEO Writers', text: 'Turn AI first drafts into publish-ready copy that matches your brand voice — without the robotic stiffness editors flag instantly.' },
  { emoji: '🎓', role: 'Students & Researchers', text: 'Polish AI-assisted notes and drafts into natural academic prose that reads like you, then add your own analysis on top.' },
  { emoji: '💼', role: 'Professionals & Founders', text: 'Reports, proposals, newsletters and emails that sound human and considered — not auto-generated and forgettable.' },
  { emoji: '🌍', role: 'Non-Native English Speakers', text: 'Let AI handle grammar and structure, then humanize for idiomatic, confident English that earns trust.' },
];

/* ── Next steps in the workflow (only tools that are live) ── */
const nextTools = [
  { href: '/grammar-checker', title: 'Grammar Checker', text: 'Fix spelling, punctuation and agreement errors without changing your style.', grad: 'from-emerald-500 to-teal-600',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { href: '/ai-detector', title: 'AI Content Detector', text: 'See how AI-like your writing reads and which sentences drive the score.', grad: 'from-cyan-500 to-blue-600',
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
];

const faqs: FAQItem[] = [
  { question: 'How do I humanize AI text with this tool?',
    answer: 'Paste your AI-generated text into the box on the left, click Humanize (or press Ctrl/⌘ + Enter), and within a few seconds you’ll get a rewritten version on the right. Copy it or download it as a .txt file. There’s nothing to install and no account to create.' },
  { question: 'Is the humanizer actually free?',
    answer: 'Yes. You can humanize up to 500 words per request, completely free, with no signup and no credit card. We keep a generous free tier so you can rely on it for everyday writing.' },
  { question: 'Will it change what my text actually says?',
    answer: 'No. The humanizer keeps your facts, arguments and intent exactly as they are. It only changes how the words are arranged — the rhythm, phrasing and word choice — so the piece reads like a person wrote it.' },
  { question: 'How does the humanizer actually change my text?',
    answer: 'It varies sentence length, swaps stock AI phrases for plainer wording, and smooths the transitions so the piece reads the way a person would write it. We don’t add invisible characters or lookalike symbols — those corrupt your text. We make no promises about how any third-party checker will score the result, and schools, employers and publishers set their own rules on AI-assisted writing, so check the policy that applies to you before you submit or publish.' },
  { question: 'Which AI models does it work with?',
    answer: 'All of them. Whether your draft came from ChatGPT, Claude, Gemini, Copilot, Perplexity, Jasper or anything else, if it was written by a model, this tool can make it sound human.' },
  { question: 'How do I get the most natural results?',
    answer: 'Work in full paragraphs rather than single sentences — context helps. For especially important pieces, run the output through a second time, then add a genuine detail or opinion only you could write. That final human layer is what makes writing truly yours.' },
  { question: 'Do you store the text I paste in?',
    answer: 'If you use the tool without an account, no: your text is processed in real time and not saved. If you are signed in, each request is saved to your private history so you can come back to it, and you can delete any entry from your dashboard. We never use your text to train anything.' },
];

const faqSchema = {
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
};

const breadcrumbSchema = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') },
    { '@type': 'ListItem', position: 2, name: 'AI Humanizer Tool', item: abs('/ai-humanizer') },
  ],
};

const Icon = ({ d, className = 'w-5 h-5' }: { d: string; className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const SectionHead = ({ tag, title, sub }: { tag: string; title: React.ReactNode; sub?: string }) => (
  <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400 mb-3">{tag}</p>
    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{title}</h2>
    {sub && <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">{sub}</p>}
  </div>
);

export default function HumanizerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}/>

      <div id="top" className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

        {/* ════════════ HERO ════════════ */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 aurora opacity-70" aria-hidden />
          <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden />
          <div className="orb w-[520px] h-[520px] -top-48 -right-32 bg-blue-400/15 dark:bg-blue-500/15 animate-float" aria-hidden />
          <div className="orb w-[420px] h-[420px] -bottom-40 -left-32 bg-violet-400/15 dark:bg-violet-500/15 animate-float-delayed" aria-hidden />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-28 sm:pb-36 text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.04] mb-5">
              AI Text <span className="gradient-text-animated">Humanizer</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-3">
              Paste your AI-generated text below and transform it into{' '}
              <strong className="font-semibold text-slate-800 dark:text-slate-100">natural, authentic human writing</strong>{' '}
              in seconds. Up to 500 words — completely free.
            </p>
            <p className="text-base sm:text-lg font-semibold text-slate-500 dark:text-slate-400 mb-9">
              Make every draft sound like <RotatingWords words={['a human', 'you', 'a pro', 'yourself']} />
            </p>

            <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {heroFeatures.map((f) => (
                <li key={f.label} className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-card">
                  <Icon d={f.icon} className="w-4 h-4 text-blue-500" />
                  {f.label}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ════════════ STUDIO ════════════ */}
        <section id="studio" className="relative -mt-20 sm:-mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <HumanizerTool />
        </section>

        {/* ════════════ Supported AI marquee ════════════ */}
        <section className="pb-16" aria-label="Compatible AI tools">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">
            Works with text from every major AI writing tool
          </p>
          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track gap-3">
              {[...supportedAI, ...supportedAI].map((tool, i) => (
                <span key={i} className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-sm font-semibold border border-slate-200 dark:border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500" />
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ Intro ════════════ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <Reveal>
            <article className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-3">The short version</p>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6">
                Turn stiff AI drafts into writing that sounds like you
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-8 mb-5">
                AI is brilliant at producing a first draft fast. The catch is that it nearly always <em>sounds</em>{' '}
                like a first draft from a machine — even, flat, and a little too polished in all the wrong places.
                Readers notice. Editors notice. This tool fixes that in one step:
                paste the text, and you get back the same ideas written the way a thoughtful person would actually write them.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-8">
                It isn&apos;t a thesaurus that swaps a few words and hopes for the best. It rewrites for <strong>rhythm</strong> —
                mixing short, direct sentences with longer ones that breathe — and strips out the tics that make AI text
                feel manufactured. Your meaning stays put. The robotic shell comes off.
              </p>
            </article>
          </Reveal>
        </section>

        {/* ════════════ Real output ════════════ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <Reveal>
            <SectionHead
              tag="Real output"
              title={<>See what you <span className="gradient-text">actually get</span></>}
              sub="These are unedited screenshots of the tool running on its own sample text: the rewrite with its Human Score, and the word-by-word view of what changed."
            />
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
            <Reveal>
              <Shot
                name="humanizer-result" width={1280} height={855}
                alt="AI Humanizer showing an AI-written paragraph on the left and the humanized rewrite on the right, with the Human Score rising from 42 to 91"
                caption="The rewrite, with a before/after Human Score (our own estimate)."
              />
            </Reveal>
            <Reveal delay={120}>
              <Shot
                name="humanizer-diff" width={1280} height={855}
                alt="AI Humanizer Changes view with removed phrases struck through in red and new wording highlighted in green"
                caption="The Changes view: removed words in red, new wording in green."
              />
            </Reveal>
          </div>
        </section>

        {/* ════════════ How it works ════════════ */}
        <section className="relative overflow-hidden bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800 py-16 sm:py-20">
          <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHead tag="Simple process" title={<>Three steps. <span className="gradient-text">About fifteen seconds.</span></>} />
            </Reveal>
            <div className="relative grid md:grid-cols-3 gap-5">
              <div className="hidden md:block absolute top-11 left-[17%] right-[17%] h-0.5 bg-gradient-to-r from-blue-300 via-violet-300 to-emerald-300 dark:from-blue-700 dark:via-violet-700 dark:to-emerald-700" aria-hidden />
              {steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 110}>
                  <div className="bento p-7 text-center h-full flex flex-col items-center group">
                    <div className="relative mb-5">
                      <span className={`absolute inset-0 bg-gradient-to-br ${s.grad} blur-xl opacity-40 group-hover:opacity-70 transition-opacity`} aria-hidden />
                      <div className={`relative w-[68px] h-[68px] rounded-3xl bg-gradient-to-br ${s.grad} text-white flex items-center justify-center ring-1 ring-white/25 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-300`}>
                        <Icon d={s.icon} className="w-8 h-8" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-card-md flex items-center justify-center text-[11px] font-black text-slate-700 dark:text-slate-200">{s.n}</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{s.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ Tells explorer ════════════ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Reveal>
            <SectionHead
              tag="What we fix"
              title="The dead giveaways we remove"
              sub="Most AI writing falls into the same handful of habits. Once you’ve seen them, you can’t unsee them — and neither can your readers. Pick one to see the kind of edit the humanizer makes:"
            />
          </Reveal>
          <Reveal>
            <TellsExplorer tells={aiTells} />
          </Reveal>
        </section>

        {/* ════════════ Style showcase ════════════ */}
        <section className="relative overflow-hidden bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800 py-16 sm:py-24">
          <div className="orb w-80 h-80 top-10 right-0 bg-violet-400/10 dark:bg-violet-500/10 animate-float-slow" aria-hidden />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHead
                tag="One draft, five voices"
                title={<>Same sentence. <span className="gradient-text">Your tone.</span></>}
                sub="Switch styles to hear how the same idea lands as casual chat, a business memo or an academic paper."
              />
            </Reveal>
            <Reveal>
              <StyleShowcase original={styleOriginal} samples={styleSamples} />
            </Reveal>
          </div>
        </section>

        {/* ════════════ Features ════════════ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Reveal>
            <SectionHead tag="Built in" title={<>More than a <span className="gradient-text">paraphraser</span></>} sub="Everything below is live in the tool above — no upsell needed." />
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={(i % 3) * 90} className={f.span}>
                <div className="bento p-7 h-full group">
                  <div className="absolute inset-0 aurora opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" aria-hidden />
                  <div className="relative">
                    <div className="relative inline-flex mb-5">
                      <span className={`absolute inset-0 bg-gradient-to-br ${f.grad} blur-lg opacity-40 group-hover:opacity-70 transition-opacity`} aria-hidden />
                      <span className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${f.grad} text-white flex items-center justify-center ring-1 ring-white/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                        <Icon d={f.icon} className="w-6 h-6" />
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.text}</p>
                    {f.chips && (
                      <div className="flex flex-wrap gap-2 mt-5">
                        {f.chips.map((c) => (
                          <span key={c} className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ════════════ Comparison ════════════ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
          <Reveal>
            <SectionHead tag="Manual editing vs. AI Humanizer" title="You could do this by hand. Here’s why you won’t want to." />
          </Reveal>
          <Reveal>
            <div className="card-premium overflow-hidden rounded-3xl">
              <div className="grid grid-cols-3 text-sm">
                <div className="px-4 sm:px-6 py-4 font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60">What matters</div>
                <div className="px-4 sm:px-6 py-4 font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 text-center">Editing manually</div>
                <div className="px-4 sm:px-6 py-4 font-black text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30 text-center">AI Humanizer</div>
                {compare.map((row, i) => (
                  <div key={row.label} className="contents">
                    <div className={`px-4 sm:px-6 py-4 font-semibold text-slate-700 dark:text-slate-200 ${i % 2 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}>{row.label}</div>
                    <div className={`px-4 sm:px-6 py-4 text-slate-500 dark:text-slate-400 text-center ${i % 2 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}>{row.manual}</div>
                    <div className={`px-4 sm:px-6 py-4 text-center font-semibold text-emerald-600 dark:text-emerald-400 ${i % 2 ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'bg-blue-50/20 dark:bg-blue-950/10'}`}>{row.tool}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ════════════ Audiences ════════════ */}
        <section className="relative overflow-hidden bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800 py-16 sm:py-24">
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHead tag="Who it’s for" title="Built for anyone who writes with AI" />
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {audiences.map((a, i) => (
                <Reveal key={a.role} delay={(i % 2) * 100}>
                  <div className="card-hover p-6 flex gap-4 h-full">
                    <span className="text-3xl flex-shrink-0">{a.emoji}</span>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white mb-1">{a.role}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{a.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════ Next in the workflow ════════════ */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <Reveal>
            <SectionHead tag="Keep going" title="Polish it before you publish" sub="Humanizing is one step. These free tools cover the rest." />
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {nextTools.map((t, i) => (
              <Reveal key={t.href} delay={i * 100}>
                <Link href={t.href} className="group block h-full">
                  <div className="bento p-7 h-full">
                    <div className="absolute inset-0 aurora opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" aria-hidden />
                    <div className="relative flex items-start gap-4">
                      <span className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.grad} text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                        <Icon d={t.icon} className="w-6 h-6" />
                      </span>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{t.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-3">{t.text}</p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 dark:text-blue-400">
                          Open tool
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ════════════ Honest note + CTA ════════════ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl card-premium p-7 sm:p-10">
              <div className="absolute inset-0 aurora opacity-40 pointer-events-none" aria-hidden />
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                  One honest tip before you go
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-8 mb-4">
                  A humanizer gets you most of the way there, fast. But the writing that truly connects always has a
                  fingerprint on it — a specific example, a strong opinion, a detail only you would know. So use this tool
                  to clear away the robotic scaffolding, then spend the two minutes you just saved adding something real.
                </p>
                <p className="text-slate-600 dark:text-slate-300 leading-8 mb-6">
                  That&apos;s the whole philosophy here: let the machine handle the heavy lifting, and keep the human part
                  human. Do that, and your writing won&apos;t just <em>pass</em> as authentic — it&apos;ll actually be good.
                </p>
                <Link href="#studio" className="btn-primary gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Humanize Your Text Now
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ════════════ FAQ ════════════ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <Reveal>
            <SectionHead tag="Questions, answered" title="Frequently Asked Questions" />
          </Reveal>
          <FAQ items={faqs} />
        </section>
      </div>
    </>
  );
}
