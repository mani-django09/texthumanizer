'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import PageHero from '@/components/PageHero';
import { withRedirectParam } from '@/lib/site';
import { usePathname } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Application {
  id: number;
  website: string | null;
  audience_description: string;
  status: 'pending' | 'approved' | 'rejected';
  affiliate_code: string | null;
  created_at: string;
}

const STATUS_STYLES = {
  pending:  { label: 'Under Review', color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800' },
  approved: { label: 'Approved',     color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' },
  rejected: { label: 'Not Approved', color: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' },
} as const;

export default function AffiliatePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const [application, setApplication] = useState<Application | null | undefined>(undefined);
  const [website, setWebsite] = useState('');
  const [audienceDescription, setAudienceDescription] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadStatus = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/affiliate/me`, { credentials: 'include' });
    const data = await res.json();
    if (res.ok) setApplication(data.application);
  }, []);

  useEffect(() => {
    if (user) loadStatus();
  }, [user, loadStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/affiliate/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ website, audienceDescription }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit application.');
      setApplication(data.application);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <PageHero
        title="Earn commission promoting"
        highlight="Text Humanizer"
        subtitle="Content creators, bloggers, and educators — get a unique link and earn a commission on every paid subscription you refer."
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { step: '1', title: 'Apply', desc: 'Tell us about your audience — takes 2 minutes.' },
            { step: '2', title: 'Get Your Link', desc: 'Once approved, get a unique tracking link.' },
            { step: '3', title: 'Earn Commission', desc: 'Get paid for every subscriber you bring in.' },
          ].map((s) => (
            <div key={s.title} className="card-hover p-5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-black flex items-center justify-center text-sm mb-3">
                {s.step}
              </div>
              <p className="font-bold text-sm text-slate-800 dark:text-white mb-1">{s.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {authLoading ? (
          <p className="text-center text-slate-400 text-sm">Loading…</p>
        ) : !user ? (
          <div className="card-premium p-8 text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-5">
              Log in or create a free account to apply for the affiliate program.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={withRedirectParam('/login', pathname)} className="btn-secondary">Log In</Link>
              <Link href={withRedirectParam('/signup', pathname)} className="btn-primary">Sign Up Free</Link>
            </div>
          </div>
        ) : application === undefined ? (
          <p className="text-center text-slate-400 text-sm">Loading…</p>
        ) : application ? (
          <div className="card-premium p-8 text-center">
            <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-full border ${STATUS_STYLES[application.status].color} mb-4`}>
              {STATUS_STYLES[application.status].label}
            </span>
            <p className="text-slate-600 dark:text-slate-300 mb-2">
              Applied on {new Date(application.created_at).toLocaleDateString()}
            </p>
            {application.status === 'approved' && application.affiliate_code && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-1">Your affiliate code:</p>
                <p className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-lg">{application.affiliate_code}</p>
              </div>
            )}
            {application.status === 'pending' && (
              <p className="text-sm text-slate-400">We typically review applications within 2-3 business days.</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-7 sm:p-8 space-y-4">
            <div>
              <label htmlFor="website" className="label-base">
                Website or social profile <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                id="website"
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourblog.com or @yourhandle"
                className="input-base"
              />
            </div>
            <div>
              <label htmlFor="audience" className="label-base">Tell us about your audience</label>
              <textarea
                id="audience"
                required
                minLength={20}
                value={audienceDescription}
                onChange={(e) => setAudienceDescription(e.target.value)}
                placeholder="Who follows you, what platforms, roughly how many people, and why they'd be interested in an AI humanizer tool…"
                rows={5}
                className="textarea-base h-auto"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-xl text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3.5 justify-center font-semibold">
              {submitting ? 'Submitting…' : 'Apply Now'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
