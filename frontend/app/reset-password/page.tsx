'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import AuthShell from '@/components/AuthShell';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push('/login'), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
          <div className="text-center mb-7">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 items-center justify-center shadow-glow-sm mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11V8a5 5 0 0110 0v3m-9 0h8a2 2 0 012 2v5a2 2 0 01-2 2H8a2 2 0 01-2-2v-5a2 2 0 012-2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1.5">Set a new password</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Choose a strong password for your account.</p>
          </div>

          {!token ? (
            <div className="text-center">
              <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-xl text-sm text-red-600 dark:text-red-400 mb-6">
                This reset link is missing a token. Please request a new one.
              </div>
              <Link href="/forgot-password" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm">
                Request a new link
              </Link>
            </div>
          ) : done ? (
            <div className="text-center">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-sm text-emerald-700 dark:text-emerald-400">
                Your password has been reset. Redirecting you to log in…
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="label-base">New Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input-base"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="label-base">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="input-base"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-xl text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 justify-center font-semibold">
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>
          )}
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
