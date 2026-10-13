'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import AuthShell from '@/components/AuthShell';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 11-12 0 6 6 0 0112 0zM3 21l6.5-6.5" />
              </svg>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1.5">Reset your password</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-sm text-emerald-700 dark:text-emerald-400 mb-6">
                If an account with that email exists, we&apos;ve sent a password reset link. Check your inbox — it expires in 30 minutes.
              </div>
              <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline text-sm">
                Back to Log In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="label-base">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-base"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-xl text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 justify-center font-semibold">
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Remembered your password?{' '}
                <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          )}
    </AuthShell>
  );
}
