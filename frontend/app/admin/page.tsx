'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Stats {
  totalUsers: number;
  newUsersToday: number;
  newUsersWeek: number;
  totalRequests: number;
  requestsToday: number;
  totalFailed: number;
  failedToday: number;
  successRate: number;
  wordsProcessed: number;
  activeToday: number;
  signupsByDay: { date: string; count: number }[];
  requestsByDay: { date: string; count: number }[];
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  request_count: number;
  last_active: string | null;
}

interface ActivityEntry {
  id: number;
  event_type: string;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  user_id: number | null;
  user_name: string | null;
  user_email: string | null;
}

type Tab = 'overview' | 'users' | 'activity' | 'messages';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

/* ── Icon set (matches site-wide SvgIcon convention) ── */
const ICONS: Record<string, React.ReactNode> = {
  users:     <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4"/>,
  sparkle:   <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 10l-5.714 2.143L13 19l-2.286-6.857L5 10l5.714-2.143L13 1z"/>,
  bolt:      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>,
  chart:     <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>,
  pulse:     <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h4l3 8 4-16 3 8h4"/>,
  doc:       <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>,
  gauge:     <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a8 8 0 1114 0M12 13l3.5-3.5M12 13a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/>,
  check:     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.5l2 2 4.5-4.5M12 3a9 9 0 100 18 9 9 0 000-18z"/>,
  warn:      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>,
  search:    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m1.35-5.15a7 7 0 11-14 0 7 7 0 0114 0z"/>,
  chevron:   <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>,
  lock:      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V8a5 5 0 0110 0v3m-9 0h8a2 2 0 012 2v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5a2 2 0 012-2z"/>,
  key:       <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 11-12 0 6 6 0 0112 0zM3 21l6.5-6.5"/>,
  logout:    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>,
  dot:       <circle cx="12" cy="12" r="10"/>,
};
const SvgIcon = ({ name, className = 'w-5 h-5' }: { name: string; className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
    {ICONS[name]}
  </svg>
);

const STAT_CONFIG = [
  { key: 'totalUsers',     label: 'Total Users',      icon: 'users',   grad: 'from-blue-500 to-cyan-500' },
  { key: 'newUsersToday',  label: 'New Today',        icon: 'sparkle', grad: 'from-emerald-500 to-teal-500' },
  { key: 'newUsersWeek',   label: 'New This Week',    icon: 'chart',   grad: 'from-violet-500 to-purple-600' },
  { key: 'activeToday',    label: 'Active Today',     icon: 'pulse',   grad: 'from-amber-500 to-orange-500' },
  { key: 'totalRequests',  label: 'Total Requests',   icon: 'bolt',    grad: 'from-blue-500 to-indigo-600' },
  { key: 'requestsToday',  label: 'Requests Today',   icon: 'bolt',    grad: 'from-cyan-500 to-blue-500' },
  { key: 'successRate',    label: 'Success Rate',     icon: 'check',   grad: 'from-emerald-500 to-green-600', suffix: '%' },
  { key: 'totalFailed',    label: 'Failed Requests',  icon: 'warn',    grad: 'from-rose-500 to-red-600' },
  { key: 'wordsProcessed', label: 'Words Processed',  icon: 'doc',     grad: 'from-rose-500 to-pink-600' },
  { key: 'avgWords',       label: 'Avg Words / Req',  icon: 'gauge',   grad: 'from-teal-500 to-emerald-600' },
] as const;

const EVENT_STYLES: Record<string, { icon: string; grad: string }> = {
  signup:   { icon: 'sparkle', grad: 'from-emerald-500 to-teal-500' },
  login:    { icon: 'key',     grad: 'from-blue-500 to-cyan-500' },
  logout:   { icon: 'logout',  grad: 'from-slate-400 to-slate-500' },
  humanize: { icon: 'bolt',    grad: 'from-violet-500 to-purple-600' },
};

function timeAgo(dateStr: string | null) {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function StatCard({ label, value, icon, grad }: { label: string; value: string | number; icon: string; grad: string }) {
  return (
    <div className="bento p-6 group">
      <div className="relative inline-flex mb-4">
        <span className={`absolute inset-0 bg-gradient-to-br ${grad} blur-md opacity-40 group-hover:opacity-70 transition-opacity`} aria-hidden />
        <span className={`relative w-11 h-11 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white ring-1 ring-white/20 group-hover:scale-105 transition-transform duration-300`}>
          <SvgIcon name={icon} className="w-5 h-5" />
        </span>
      </div>
      <div className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{value}</div>
      <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</div>
    </div>
  );
}

function TrendChart({ data, grad }: { data: { date: string; count: number }[]; grad: string }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <div>
      <div className="flex items-end justify-between mb-4">
        <span className="text-2xl font-black text-slate-900 dark:text-white">{total}</span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Last 14 days</span>
      </div>
      <div className="flex items-end gap-1.5 h-28">
        {data.map((d) => (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1.5 group/bar relative">
            <div className="absolute -top-7 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-card whitespace-nowrap">
              {d.count}
            </div>
            <div
              className={`w-full rounded-t-lg bg-gradient-to-t ${grad} transition-all duration-300 group-hover/bar:opacity-80`}
              style={{ height: `${Math.max((d.count / max) * 100, 4)}%` }}
            />
            <span className="text-[9px] text-slate-400 hidden sm:block">{new Date(d.date).getDate()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [activityTotal, setActivityTotal] = useState(0);
  const [activityPage, setActivityPage] = useState(1);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesTotal, setMessagesTotal] = useState(0);

  const loadStats = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/admin/stats`, { credentials: 'include' });
    if (res.status === 403) return setForbidden(true);
    if (res.status === 401) return router.push('/login?redirect=/admin');
    const data = await res.json();
    if (res.ok) setStats(data);
    else setError(data.error || 'Failed to load stats.');
  }, [router]);

  const loadUsers = useCallback(async (page: number, q: string) => {
    const params = new URLSearchParams({ page: String(page), limit: '25' });
    if (q) params.set('search', q);
    const res = await fetch(`${API_URL}/api/admin/users?${params}`, { credentials: 'include' });
    const data = await res.json();
    if (res.ok) {
      setUsers(data.users);
      setUsersTotal(data.total);
    }
  }, []);

  const loadActivity = useCallback(async (page: number) => {
    const params = new URLSearchParams({ page: String(page), limit: '50' });
    const res = await fetch(`${API_URL}/api/admin/activity?${params}`, { credentials: 'include' });
    const data = await res.json();
    if (res.ok) {
      setActivity(data.activity);
      setActivityTotal(data.total);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/admin');
      return;
    }
    if (user) loadStats();
  }, [authLoading, user, router, loadStats]);

  useEffect(() => {
    if (tab === 'users' && user) loadUsers(usersPage, search);
  }, [tab, usersPage, search, user, loadUsers]);

  useEffect(() => {
    if (tab === 'activity' && user) loadActivity(activityPage);
  }, [tab, activityPage, user, loadActivity]);

  useEffect(() => {
    if (tab !== 'messages' || !user) return;
    fetch(`${API_URL}/api/admin/messages?limit=50`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Failed to load messages.'))))
      .then((data) => { setMessages(data.messages); setMessagesTotal(data.total); })
      .catch((err) => setError(err.message));
  }, [tab, user]);

  if (forbidden) {
    return (
      <section className="relative min-h-[70vh] flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 aurora opacity-30" aria-hidden />
        <div className="relative">
          <div className="relative inline-flex mb-6">
            <span className="absolute inset-0 bg-gradient-to-br from-rose-500 to-red-600 blur-xl opacity-50" aria-hidden />
            <span className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white ring-1 ring-white/20">
              <SvgIcon name="lock" className="w-8 h-8" />
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Admin access required</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">You don&apos;t have permission to view this page.</p>
          <Link href="/" className="btn-primary">Back to Home</Link>
        </div>
      </section>
    );
  }

  const avgWords = stats && stats.totalRequests ? Math.round(stats.wordsProcessed / stats.totalRequests) : 0;
  const statValues: Record<string, number> = stats
    ? {
        totalUsers: stats.totalUsers,
        newUsersToday: stats.newUsersToday,
        newUsersWeek: stats.newUsersWeek,
        activeToday: stats.activeToday,
        totalRequests: stats.totalRequests,
        requestsToday: stats.requestsToday,
        successRate: stats.successRate,
        totalFailed: stats.totalFailed,
        wordsProcessed: stats.wordsProcessed,
        avgWords,
      }
    : {};

  return (
    <section className="relative min-h-screen bg-slate-50/50 dark:bg-slate-950 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-96 aurora opacity-25 pointer-events-none" aria-hidden />
      <div className="absolute top-0 inset-x-0 h-96 grid-pattern opacity-20 pointer-events-none" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="badge-violet inline-flex mb-3">
              <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
              Admin
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Control <span className="gradient-text">Center</span>
            </h1>
          </div>
        </div>

        {/* Segmented tabs */}
        <div className="inline-flex items-center p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-card mb-8">
          {(['overview', 'users', 'activity', 'messages'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold capitalize transition-all duration-300 ${
                tab === t
                  ? 'bg-gradient-to-br from-slate-900 to-violet-950 text-white shadow-card-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-xl text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <>
            {!stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bento p-6 h-32 animate-pulse bg-slate-100 dark:bg-slate-800/50" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {STAT_CONFIG.map((s) => {
                    const suffix = 'suffix' in s ? s.suffix : '';
                    const raw = s.key === 'wordsProcessed' ? statValues[s.key].toLocaleString() : statValues[s.key];
                    return (
                      <StatCard
                        key={s.key}
                        label={s.label}
                        value={`${raw}${suffix}`}
                        icon={s.icon}
                        grad={s.grad}
                      />
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="card-premium p-6 relative overflow-hidden">
                    <div className="absolute inset-0 aurora opacity-20 pointer-events-none" aria-hidden />
                    <h3 className="relative font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <SvgIcon name="users" className="w-4 h-4 text-blue-500" />
                      Signups
                    </h3>
                    <div className="relative">
                      <TrendChart data={stats.signupsByDay} grad="from-blue-500 to-cyan-400" />
                    </div>
                  </div>
                  <div className="card-premium p-6 relative overflow-hidden">
                    <div className="absolute inset-0 aurora opacity-20 pointer-events-none" aria-hidden />
                    <h3 className="relative font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                      <SvgIcon name="bolt" className="w-4 h-4 text-violet-500" />
                      Humanize Requests
                    </h3>
                    <div className="relative">
                      <TrendChart data={stats.requestsByDay} grad="from-violet-500 to-purple-400" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── Users ── */}
        {tab === 'users' && (
          <div className="card-premium overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-700">
              <div className="relative max-w-sm">
                <SvgIcon name="search" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or email…"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setUsersPage(1); }}
                  className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 pl-10 pr-4 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                    <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">User</th>
                    <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Role</th>
                    <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Requests</th>
                    <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Joined</th>
                    <th className="px-5 py-3 font-bold text-xs uppercase tracking-wider">Last Active</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => router.push(`/admin/users/${u.id}`)}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <span className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 blur-sm opacity-0 group-hover:opacity-50 transition-opacity" aria-hidden />
                            <span className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold ring-1 ring-white/20 flex-shrink-0">
                              {u.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-white">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                          {u.role === 'admin' && <SvgIcon name="key" className="w-2.5 h-2.5" />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-semibold">{u.request_count}</td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{new Date(u.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">{timeAgo(u.last_active)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <SvgIcon name="chevron" className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all ml-auto" />
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={6} className="px-5 py-14 text-center text-slate-400">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700 text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{usersTotal} total users</span>
              <div className="flex gap-2">
                <button disabled={usersPage <= 1} onClick={() => setUsersPage((p) => p - 1)} className="btn-ghost px-4 py-1.5 disabled:opacity-40">Prev</button>
                <button disabled={usersPage * 25 >= usersTotal} onClick={() => setUsersPage((p) => p + 1)} className="btn-ghost px-4 py-1.5 disabled:opacity-40">Next</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Activity ── */}
        {tab === 'activity' && (
          <div className="card-premium overflow-hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {activity.map((a) => {
                const isHumanize = a.event_type === 'humanize';
                const success = a.metadata && typeof a.metadata === 'object' ? a.metadata.success : undefined;
                const isFailed = isHumanize && success === false;
                const style = isFailed
                  ? { icon: 'warn', grad: 'from-rose-500 to-red-600' }
                  : EVENT_STYLES[a.event_type] || { icon: 'dot', grad: 'from-slate-400 to-slate-500' };
                return (
                  <div key={a.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/70 dark:hover:bg-slate-900/40 transition-colors group">
                    <div className="relative flex-shrink-0">
                      <span className={`absolute inset-0 bg-gradient-to-br ${style.grad} blur-md opacity-30 group-hover:opacity-60 transition-opacity`} aria-hidden />
                      <span className={`relative w-10 h-10 rounded-full bg-gradient-to-br ${style.grad} flex items-center justify-center text-white ring-1 ring-white/20`}>
                        <SvgIcon name={style.icon} className="w-4.5 h-4.5" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2 flex-wrap">
                        <span>
                          <span className="font-bold">{a.user_name || 'Guest'}</span>{' '}
                          <span className="font-medium capitalize text-slate-500 dark:text-slate-400">{a.event_type}</span>
                          {a.metadata && typeof a.metadata === 'object' && 'word_count' in a.metadata && (
                            <span className="text-slate-400"> — {String(a.metadata.word_count)} words</span>
                          )}
                        </span>
                        {isHumanize && (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isFailed
                              ? 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                              : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            <SvgIcon name={isFailed ? 'warn' : 'check'} className="w-2.5 h-2.5" />
                            {isFailed ? 'Failed' : 'Success'}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {a.user_email || a.ip_address || ''}
                        {isFailed && a.metadata && typeof a.metadata === 'object' && 'reason' in a.metadata && (
                          <span className="text-red-400"> · {String(a.metadata.reason)}</span>
                        )}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-slate-400 flex-shrink-0">{timeAgo(a.created_at)}</span>
                  </div>
                );
              })}
              {activity.length === 0 && (
                <p className="px-5 py-14 text-center text-slate-400">No activity yet.</p>
              )}
            </div>
            <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700 text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{activityTotal} total events</span>
              <div className="flex gap-2">
                <button disabled={activityPage <= 1} onClick={() => setActivityPage((p) => p - 1)} className="btn-ghost px-4 py-1.5 disabled:opacity-40">Prev</button>
                <button disabled={activityPage * 50 >= activityTotal} onClick={() => setActivityPage((p) => p + 1)} className="btn-ghost px-4 py-1.5 disabled:opacity-40">Next</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Contact messages ── */}
        {tab === 'messages' && (
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id} className="card-premium p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <p className="text-sm">
                    <span className="font-bold text-slate-800 dark:text-white">{m.name}</span>{' '}
                    <a href={`mailto:${m.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{m.email}</a>
                  </p>
                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300">{m.subject}</span>
                    {timeAgo(m.created_at)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">{m.message}</p>
              </div>
            ))}
            {messages.length === 0 && (
              <p className="card-premium px-5 py-14 text-center text-slate-400">No messages yet.</p>
            )}
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{messagesTotal} total messages (showing latest 50)</p>
          </div>
        )}
      </div>
    </section>
  );
}
