'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface UserDetail {
  id: number;
  name: string;
  email: string;
  role: string;
  has_google: boolean;
  created_at: string;
}

interface HistoryItem {
  id: number;
  input_text: string;
  output_text: string;
  word_count: number;
  created_at: string;
}

interface ActivityItem {
  id: number;
  event_type: string;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

const ICONS: Record<string, React.ReactNode> = {
  back:     <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>,
  lock:     <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V8a5 5 0 0110 0v3m-9 0h8a2 2 0 012 2v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5a2 2 0 012-2z"/>,
  google:   <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>,
  mail:     <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>,
  bolt:     <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>,
  clock:    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>,
  key:      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 11-12 0 6 6 0 0112 0zM3 21l6.5-6.5"/>,
};
const SvgIcon = ({ name, className = 'w-5 h-5' }: { name: string; className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
    {ICONS[name]}
  </svg>
);

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, loading: authLoading } = useAuth();
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [error, setError] = useState('');
  const [forbidden, setForbidden] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/admin/users/${params.id}`, { credentials: 'include' });
    if (res.status === 403) return setForbidden(true);
    if (res.status === 401) return router.push('/login?redirect=/admin');
    const data = await res.json();
    if (res.ok) {
      setDetail(data.user);
      setHistory(data.history);
      setActivity(data.activity);
    } else {
      setError(data.error || 'Failed to load user.');
    }
  }, [params.id, router]);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/login?redirect=/admin');
      return;
    }
    if (currentUser) load();
  }, [authLoading, currentUser, router, load]);

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
          <Link href="/" className="btn-primary">Back to Home</Link>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center text-center px-4">
        <div>
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/admin" className="btn-primary">Back to Dashboard</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-slate-50/50 dark:bg-slate-950 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-80 aurora opacity-25 pointer-events-none" aria-hidden />
      <div className="absolute top-0 inset-x-0 h-80 grid-pattern opacity-20 pointer-events-none" aria-hidden />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors">
          <SvgIcon name="back" className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {!detail ? (
          <div className="space-y-6">
            <div className="card-premium p-6 h-28 animate-pulse bg-slate-100 dark:bg-slate-800/50" />
            <div className="card-premium p-6 h-48 animate-pulse bg-slate-100 dark:bg-slate-800/50" />
          </div>
        ) : (
          <>
            {/* Profile card */}
            <div className="card-premium p-7 mb-6 relative overflow-hidden">
              <div className="absolute inset-0 aurora opacity-20 pointer-events-none" aria-hidden />
              <div className="relative flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <span className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-600 blur-lg opacity-50" aria-hidden />
                  <span className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black ring-1 ring-white/20">
                    {detail.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{detail.name}</h1>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${detail.role === 'admin' ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                      {detail.role === 'admin' && <SvgIcon name="key" className="w-2.5 h-2.5" />}
                      {detail.role}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <SvgIcon name="mail" className="w-3.5 h-3.5" />
                    {detail.email}
                  </p>
                  <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <SvgIcon name="clock" className="w-3 h-3" />
                      Joined {new Date(detail.created_at).toLocaleDateString()}
                    </span>
                    <span className={`badge text-[10px] py-0.5 ${detail.has_google ? 'badge-blue' : 'badge-violet'}`}>
                      {detail.has_google ? 'Google account' : 'Email account'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bento p-5">
                <div className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">{history.length}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Humanize Requests</div>
              </div>
              <div className="bento p-5">
                <div className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">{activity.length}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Activity Events</div>
              </div>
            </div>

            {/* History */}
            <div className="card-premium p-6 mb-6">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
                  <SvgIcon name="bolt" className="w-3.5 h-3.5" />
                </span>
                Humanize History
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {history.map((h) => (
                  <div key={h.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-800/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded-full">{h.word_count} words</span>
                      <span className="text-xs text-slate-400">{new Date(h.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{truncate(h.input_text, 150)}</p>
                  </div>
                ))}
                {history.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No requests yet.</p>}
              </div>
            </div>

            {/* Activity */}
            <div className="card-premium p-6">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                  <SvgIcon name="clock" className="w-3.5 h-3.5" />
                </span>
                Activity Log
              </h2>
              <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                {activity.map((a) => (
                  <div key={a.id} className="flex items-center justify-between text-sm py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 capitalize">{a.event_type}</span>
                    <span className="text-xs text-slate-400">{new Date(a.created_at).toLocaleString()}</span>
                  </div>
                ))}
                {activity.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No activity yet.</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
