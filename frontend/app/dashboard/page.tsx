'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import { abs } from '@/lib/site';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface HistoryItem {
  id: number;
  input_text: string;
  output_text: string;
  word_count: number;
  created_at: string;
}

interface UsageStats {
  totalRequests: number;
  totalWords: number;
  requestsThisMonth: number;
  wordsThisMonth: number;
  dailyBreakdown: { date: string; requests: number; words: number }[];
}

interface ReferralInfo {
  referralCode: string;
  bonusWords: number;
  referralCount: number;
  bonusPerReferral: number;
  maxBonusWords: number;
}

interface BillingInfo {
  plan: string;
  planName: string;
  wordsPerRequest: number | null;
  wordsPerMonth: number | null;
  wordsUsed: number;
  wordsRemaining: number | null;
  bonusWords: number;
  subscription: {
    plan: string;
    status: string;
    renewsAt: string | null;
    endsAt: string | null;
    cardBrand: string | null;
    cardLastFour: string | null;
  } | null;
}

const PLAN_BADGE: Record<string, string> = {
  free: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  basic: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
  pro: 'bg-violet-50 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800/60',
  unlimited: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  on_trial: 'On Trial',
  past_due: 'Payment Failed',
  cancelled: 'Cancelling',
  expired: 'Expired',
  paused: 'Paused',
  unpaid: 'Unpaid',
};

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function MiniBarChart({ data }: { data: { date: string; requests: number }[] }) {
  const max = Math.max(...data.map((d) => d.requests), 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d) => (
        <div key={d.date} className="flex-1 group relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-card whitespace-nowrap z-10">
            {d.requests}
          </div>
          <div
            className="w-full rounded-t bg-gradient-to-t from-blue-500 to-cyan-400 transition-all"
            style={{ height: `${Math.max((d.requests / max) * 100, 3)}%` }}
          />
        </div>
      ))}
    </div>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, logout } = useAuth();
  const [history, setHistory] = useState<HistoryItem[] | null>(null);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [referral, setReferral] = useState<ReferralInfo | null>(null);
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [showUpgraded, setShowUpgraded] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/history`, { credentials: 'include' });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load history.');
      setHistory(data.history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history.');
    }
  }, [router]);

  const loadStats = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/history/stats`, { credentials: 'include' });
    const data = await res.json();
    if (res.ok) setStats(data);
  }, []);

  const loadReferral = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/referral/me`, { credentials: 'include' });
    const data = await res.json();
    if (res.ok) setReferral(data);
  }, []);

  const loadBilling = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/billing/me`, { credentials: 'include' });
    const data = await res.json();
    if (res.ok) setBilling(data);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
    if (user) {
      loadHistory();
      loadStats();
      loadReferral();
      loadBilling();
    }
  }, [authLoading, user, router, loadHistory, loadStats, loadReferral, loadBilling]);

  // Landed here right after a Lemon Squeezy checkout — the webhook may take a
  // few seconds to arrive, so poll billing briefly instead of showing stale data.
  useEffect(() => {
    if (searchParams.get('upgraded') !== '1' || !user) return;
    setShowUpgraded(true);
    router.replace('/dashboard');

    let attempts = 0;
    const interval = setInterval(() => {
      attempts += 1;
      loadBilling();
      if (attempts >= 5) clearInterval(interval);
    }, 2500);
    return () => clearInterval(interval);
  }, [searchParams, user, router, loadBilling]);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/billing/portal`, { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not open the billing portal.');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open the billing portal.');
      setPortalLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await fetch(`${API_URL}/api/history/${id}`, { method: 'DELETE', credentials: 'include' });
      setHistory((prev) => (prev ? prev.filter((h) => h.id !== id) : prev));
    } catch {
      setError('Failed to delete entry. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const referralLink = referral ? abs(`/signup?ref=${referral.referralCode}`) : '';

  const handleCopyReferral = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setError('Clipboard access denied. Please copy the link manually.');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading…</p>
      </div>
    );
  }

  // null = plan has no per-request cap; before billing loads, assume the free limit.
  const maxWords = billing ? billing.wordsPerRequest : 500;
  const planName = billing?.planName || 'Free account';
  const planKey = billing?.plan || 'free';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {showUpgraded && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-start gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">Payment received — thank you!</p>
              <p className="text-emerald-700 dark:text-emerald-400/80 text-sm mt-0.5">
                Your subscription is being activated. This usually takes just a few seconds to reflect below.
              </p>
            </div>
            <button onClick={() => setShowUpgraded(false)} className="text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300 flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl card-premium p-6 sm:p-8 mb-8">
          <div className="absolute inset-0 aurora opacity-30 pointer-events-none" aria-hidden />
          <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" aria-hidden />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xl font-black shadow-glow-sm">
                {user.name.trim().charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight truncate">
                  Welcome, {user.name.split(' ')[0]}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 truncate">{user.email}</p>
              </div>
            </div>

            <button onClick={handleLogout} className="btn-secondary text-sm py-2.5 px-4 self-start sm:self-auto flex-shrink-0">
              Log Out
            </button>
          </div>

          <div className="relative flex flex-wrap items-center gap-2 mt-5">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${PLAN_BADGE[planKey] || PLAN_BADGE.free}`}>
              {planKey === 'unlimited' ? '👑' : planKey === 'pro' ? '⚡' : planKey === 'basic' ? '✨' : '🆓'} {planName}
            </span>
            {billing?.subscription && billing.subscription.status !== 'active' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 px-3 py-1.5 rounded-full">
                {STATUS_LABEL[billing.subscription.status] || billing.subscription.status}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 px-3 py-1.5 rounded-full">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {maxWords === null ? 'Unlimited' : maxWords.toLocaleString()} words per request
            </span>
            {(user.bonusWords || 0) > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-full">
                🎁 +{user.bonusWords} bonus words
              </span>
            )}
          </div>
        </div>

        {/* Plan & usage */}
        <div className="card-premium p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white flex items-center gap-2">
                Your Plan
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${PLAN_BADGE[planKey] || PLAN_BADGE.free}`}>{planName}</span>
              </h3>
              {billing?.subscription?.renewsAt && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Renews {new Date(billing.subscription.renewsAt).toLocaleDateString()}
                  {billing.subscription.cardLastFour && ` · ${billing.subscription.cardBrand || 'Card'} ending ${billing.subscription.cardLastFour}`}
                </p>
              )}
              {billing?.subscription?.status === 'cancelled' && billing.subscription.endsAt && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  Access ends {new Date(billing.subscription.endsAt).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              {billing?.subscription ? (
                <button onClick={handleManageSubscription} disabled={portalLoading} className="btn-secondary text-sm py-2.5 px-4 gap-2 disabled:opacity-60">
                  {portalLoading ? 'Opening…' : 'Manage Subscription'}
                </button>
              ) : (
                <Link href="/pricing" className="btn-primary text-sm py-2.5 px-4 gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Upgrade Plan
                </Link>
              )}
            </div>
          </div>

          {billing && billing.wordsPerMonth !== null && (
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                <span>{billing.wordsUsed.toLocaleString()} / {billing.wordsPerMonth.toLocaleString()} words this month</span>
                <span>{(billing.wordsRemaining ?? 0).toLocaleString()} remaining</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    billing.wordsUsed / billing.wordsPerMonth > 0.9
                      ? 'bg-red-500'
                      : billing.wordsUsed / billing.wordsPerMonth > 0.7
                      ? 'bg-amber-500'
                      : 'bg-gradient-to-r from-blue-500 to-violet-500'
                  }`}
                  style={{ width: `${Math.min((billing.wordsUsed / billing.wordsPerMonth) * 100, 100)}%` }}
                />
              </div>
              {billing.plan === 'free' && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  Need more? <Link href="/pricing" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Upgrade to a paid plan</Link> for a larger monthly pool.
                </p>
              )}
            </div>
          )}

          {billing && billing.wordsPerMonth === null && (
            <p className="text-sm text-slate-500 dark:text-slate-400">No monthly word cap on your plan.</p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-xl text-sm text-red-600 dark:text-red-400 mb-5">
            {error}
          </div>
        )}

        {/* Usage stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { value: stats.requestsThisMonth.toLocaleString(), label: 'Requests This Month', tone: 'icon-box-blue',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /> },
              { value: stats.wordsThisMonth.toLocaleString(), label: 'Words This Month', tone: 'icon-box-violet',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /> },
              { value: stats.totalRequests.toLocaleString(), label: 'Total Requests', tone: 'icon-box-cyan',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
              { value: stats.totalWords.toLocaleString(), label: 'Total Words', tone: 'icon-box-green',
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
            ].map((s) => (
              <div key={s.label} className="bento p-5">
                <div className={`${s.tone} w-9 h-9 rounded-lg mb-3`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white mb-0.5 tabular-nums">{s.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Activity chart */}
        {stats && stats.dailyBreakdown.some((d) => d.requests > 0) && (
          <div className="card-premium p-5 mb-8">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">Last 30 Days</h3>
            <MiniBarChart data={stats.dailyBreakdown} />
          </div>
        )}

        {/* Referral program */}
        {referral && (
          <div className="card-premium p-6 mb-8 relative overflow-hidden">
            <div className="absolute inset-0 aurora opacity-20 pointer-events-none" aria-hidden />
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🎁</span>
                <h3 className="font-black text-slate-900 dark:text-white">Refer Friends, Earn Bonus Words</h3>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Share your link — you and your friend each get +{referral.bonusPerReferral} bonus words added to your monthly allowance when they sign up.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <input
                  readOnly
                  value={referralLink}
                  className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300"
                />
                <button onClick={handleCopyReferral} className="btn-primary px-5 py-2.5 gap-2 justify-center whitespace-nowrap">
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">{referral.referralCount}</strong> referrals
                </span>
                <span className="text-slate-600 dark:text-slate-300">
                  <strong className="text-emerald-600 dark:text-emerald-400">+{referral.bonusWords}</strong> bonus words earned
                  {referral.bonusWords >= referral.maxBonusWords && (
                    <span className="text-slate-400"> (max reached)</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* History */}
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-box-blue"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Your Humanize History</h2>
        </div>

        {history === null && !error && (
          <p className="text-slate-400 text-sm">Loading your history…</p>
        )}

        {history !== null && history.length === 0 && (
          <div className="card-premium p-10 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
              You haven&apos;t humanized anything yet.
            </p>
            <a href="/ai-humanizer" className="btn-primary inline-flex gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Humanize Text
            </a>
          </div>
        )}

        <div className="space-y-4">
          {history?.map((item) => (
            <div key={item.id} className="card-hover p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {new Date(item.created_at).toLocaleString()} · {item.word_count} words
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  title="Delete"
                  className="text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Input</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{truncate(item.input_text, 220)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 mb-1">Humanized</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{truncate(item.output_text, 220)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContent />
    </Suspense>
  );
}
