'use client';

import { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import FAQ, { FAQItem } from '@/components/FAQ';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

type Cycle = 'monthly' | 'yearly';
type PlanId = 'basic' | 'pro' | 'unlimited';

const plans = [
  {
    id: 'basic' as PlanId,
    name: 'Basic',
    tagline: 'For everyday writers',
    monthly: 9,
    annual: 72,
    wordsPerMonth: '15,000 words/month',
    theme: 'light' as const,
    features: [
      '2,000 words per request',
      'All 5 rewrite styles',
      'Human Score on every rewrite',
      'Before/after diff view',
      'Saved history',
      'Grammar, plagiarism & AI detector included',
    ],
  },
  {
    id: 'pro' as PlanId,
    name: 'Pro',
    tagline: 'For serious content creators',
    monthly: 19,
    annual: 144,
    wordsPerMonth: '50,000 words/month',
    theme: 'dark' as const,
    popular: true,
    features: [
      'Unlimited words per request',
      'Everything in Basic',
      'File upload (.docx, .pdf, .txt)',
      'Sentence-level regenerate',
      'Higher rate limits',
      'Priority email support',
    ],
  },
  {
    id: 'unlimited' as PlanId,
    name: 'Unlimited',
    tagline: 'For teams & power users',
    monthly: 33,
    annual: 240,
    wordsPerMonth: 'Unlimited words/month',
    theme: 'light' as const,
    features: [
      'Unlimited words per request',
      'Everything in Pro',
      'No monthly word cap',
      'Highest rate limits',
      'Priority email support',
      'Cancel anytime',
    ],
  },
];

const savePct = (monthly: number, annual: number) => Math.round(((monthly * 12 - annual) / (monthly * 12)) * 100);
const maxSavePct = Math.max(...plans.map((p) => savePct(p.monthly, p.annual)));

const faqs: FAQItem[] = [
  {
    question: 'Can I try it before I pay?',
    answer: 'Yes. Yes. Every tool is free to use at up to 500 words per request and 5,000 words per month, with or without an account. A free account adds saved history and usage tracking. No card required.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. There are no long-term contracts. You can cancel your subscription at any time from your dashboard, and you\'ll keep access until the end of your current billing period.',
  },
  {
    question: 'What\'s the difference between Basic, Pro, and Unlimited?',
    answer: 'Basic caps requests at 2,000 words each with a 15,000 word monthly pool — good for occasional use. Pro and Unlimited remove the per-request word cap entirely, with Unlimited also removing the monthly pool cap — best for teams and heavy daily use.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'If something isn\'t working as expected, contact us within 7 days of your purchase at hello@texthumanizer.site and we\'ll make it right.',
  },
  {
    question: 'How does yearly billing work?',
    answer: 'Yearly plans are billed once upfront at the discounted annual rate shown above, instead of monthly. You save up to 39% compared to paying month-to-month.',
  },
  {
    question: 'Can I switch plans later?',
    answer: 'Yes. You can upgrade or downgrade your plan at any time from your dashboard — changes take effect on your next billing cycle.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

/**
 * Reads ?checkout=1&plan=&cycle= to resume a purchase after signup/login.
 * Isolated here (its own Suspense boundary) because useSearchParams() forces
 * whatever it's called in to skip static prerendering — keeping it out of
 * PricingContent means the H1, plan cards and FAQ schema below still render
 * in the static HTML for crawlers and link-preview bots that don't run JS.
 */
function CheckoutAutoTrigger({ onAutoCheckout }: { onAutoCheckout: (plan: PlanId, cycle: Cycle) => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const autoTriggered = useRef(false);

  useEffect(() => {
    if (authLoading || autoTriggered.current || !user) return;
    const wantsCheckout = searchParams.get('checkout') === '1';
    const planParam = searchParams.get('plan') as PlanId | null;
    const cycleParam = (searchParams.get('cycle') as Cycle | null) || 'monthly';
    if (wantsCheckout && planParam && plans.some((p) => p.id === planParam)) {
      autoTriggered.current = true;
      router.replace(pathname);
      onAutoCheckout(planParam, cycleParam);
    }
  }, [authLoading, user, searchParams, pathname, router, onAutoCheckout]);

  return null;
}

function PricingContent() {
  const [cycle, setCycle] = useState<Cycle>('monthly');
  const [pendingPlan, setPendingPlan] = useState<PlanId | null>(null);
  const [checkoutError, setCheckoutError] = useState('');
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const startCheckout = useCallback(async (planId: PlanId, billingCycle: Cycle) => {
    setCheckoutError('');
    setPendingPlan(planId);
    try {
      const res = await fetch(`${API_URL}/api/billing/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ plan: planId, cycle: billingCycle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not start checkout. Please try again.');
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Could not start checkout. Please try again.');
      setPendingPlan(null);
    }
  }, []);

  const handleBuyClick = (planId: PlanId) => {
    if (authLoading) return;
    if (!user) {
      const redirectTarget = `/pricing?plan=${planId}&cycle=${cycle}&checkout=1`;
      router.push(`/signup?redirect=${encodeURIComponent(redirectTarget)}`);
      return;
    }
    startCheckout(planId, cycle);
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 section-padding">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Suspense fallback={null}>
        <CheckoutAutoTrigger onAutoCheckout={startCheckout} />
      </Suspense>
      <div className="absolute inset-0 aurora opacity-40" aria-hidden />
      <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />

      <div className="relative container-max">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="section-heading mb-4">
            Choose Your <span className="gradient-text">Humanizing Power</span>
          </h1>
          <p className="section-sub">
            Start free, upgrade anytime. Cancel whenever you want — no questions asked.
          </p>
        </div>

        {checkoutError && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-xl text-sm text-red-600 dark:text-red-400 text-center">
            {checkoutError}
          </div>
        )}

        {/* Billing toggle — segmented control */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-card">
            <button
              onClick={() => setCycle('monthly')}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                cycle === 'monthly'
                  ? 'bg-gradient-to-br from-slate-900 to-violet-950 text-white shadow-card-md'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setCycle('yearly')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                cycle === 'yearly'
                  ? 'bg-gradient-to-br from-slate-900 to-violet-950 text-white shadow-card-md'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Yearly
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  cycle === 'yearly' ? 'bg-white text-violet-700' : 'bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300'
                }`}
              >
                Save up to {maxSavePct}%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan) => {
            const isYearly = cycle === 'yearly';
            const displayPrice = isYearly ? Math.round(plan.annual / 12) : plan.monthly;
            const isDark = plan.theme === 'dark';
            const discount = savePct(plan.monthly, plan.annual);
            const isPending = pendingPlan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col ${
                  isDark
                    ? 'bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white shadow-2xl md:-my-4 md:py-12 ring-1 ring-violet-500/30'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-card'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-glow-sm">
                    Most Popular
                  </span>
                )}

                <div className="flex items-start justify-between gap-3 mb-1">
                  <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {plan.name}
                  </h2>
                  {isYearly && (
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                        isDark ? 'bg-emerald-400/20 text-emerald-300' : 'bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300'
                      }`}
                    >
                      Save {discount}%
                    </span>
                  )}
                </div>
                <p className={`text-sm mb-4 ${isDark ? 'text-violet-200' : 'text-slate-500 dark:text-slate-400'}`}>
                  {plan.tagline}
                </p>
                <p className={`text-sm font-semibold mb-5 ${isDark ? 'text-violet-300' : 'text-blue-600 dark:text-blue-400'}`}>
                  {plan.wordsPerMonth}
                </p>

                <div className="flex items-end gap-1.5 mb-1">
                  <span className={`text-5xl font-black ${isDark ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    ${displayPrice}
                  </span>
                  <span className={`text-sm mb-1.5 ${isDark ? 'text-violet-300' : 'text-slate-400'}`}>
                    Per month{isYearly ? ' ,' : ''}
                  </span>
                </div>
                {isYearly && (
                  <p className={`text-sm mb-5 ${isDark ? 'text-violet-300' : 'text-slate-400'}`}>
                    Billed ${plan.annual} Annually
                  </p>
                )}
                {!isYearly && <div className="mb-5" />}

                <button
                  onClick={() => handleBuyClick(plan.id)}
                  disabled={pendingPlan !== null || authLoading}
                  className={`w-full flex items-center justify-center gap-2 text-center py-3.5 rounded-xl font-bold mb-7 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${
                    isDark
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-glow-sm hover:-translate-y-0.5'
                      : 'bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:shadow-card-lg hover:-translate-y-0.5'
                  }`}
                >
                  {isPending ? (<><Spinner /> Redirecting…</>) : 'Buy Now'}
                </button>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <svg
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={isDark ? 'text-violet-100' : 'text-slate-600 dark:text-slate-300'}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Free tier note */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-12 mb-16">
          Not ready to commit?{' '}
          <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Start free
          </Link>{' '}
          with 500 words per request — no card required.
        </p>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="badge-blue inline-flex mb-4">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Have Questions?
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <FAQ items={faqs} />
        </div>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return <PricingContent />;
}
