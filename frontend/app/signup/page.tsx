'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import GoogleSignInButton from '@/components/GoogleSignInButton';
import AuthShell from '@/components/AuthShell';
import { safeRedirect } from '@/lib/site';

/** Cheap visual strength meter — guidance only, the server enforces the real rule. */
function strengthOf(pw: string): { score: 0 | 1 | 2 | 3; label: string; bar: string; text: string } {
  if (pw.length < 6) return { score: 0, label: 'Too short', bar: 'w-1/4 bg-red-500',    text: 'text-red-500' };
  let hits = 0;
  if (pw.length >= 10) hits++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) hits++;
  if (/\d/.test(pw)) hits++;
  if (/[^A-Za-z0-9]/.test(pw)) hits++;
  if (hits <= 1) return { score: 1, label: 'Weak',   bar: 'w-2/4 bg-amber-500',   text: 'text-amber-500' };
  if (hits === 2) return { score: 2, label: 'Good',   bar: 'w-3/4 bg-blue-500',    text: 'text-blue-500' };
  return { score: 3, label: 'Strong', bar: 'w-full bg-emerald-500', text: 'text-emerald-500' };
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = safeRedirect(searchParams.get('redirect'));
  const loginHref = redirectTo === '/dashboard' ? '/login' : `/login?redirect=${encodeURIComponent(redirectTo)}`;
  const referralCode = searchParams.get('ref') || undefined;

  const strength = strengthOf(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(name, email, password, referralCode);
      router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <div className="text-center mb-7">
        <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 items-center justify-center shadow-glow-sm mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-1.5">Create your account</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Free forever. Save your history, track your usage and earn bonus words by inviting friends.</p>
        {referralCode && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-full">
            🎁 You&apos;ll both get +200 bonus words for signing up via a referral
          </p>
        )}
      </div>

      <GoogleSignInButton onError={setError} onSuccess={() => router.push(redirectTo)} referralCode={referralCode} />

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="label-base">Name</label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="input-base"
          />
        </div>

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

        <div>
          <label htmlFor="password" className="label-base">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="input-base pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {password && (
            <div className="mt-2 flex items-center gap-2.5">
              <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${strength.bar}`} />
              </div>
              <span className={`text-xs font-bold ${strength.text}`}>{strength.label}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-xl flex items-start gap-2.5 animate-fade-in">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 justify-center font-bold gap-2.5">
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account…
            </>
          ) : 'Create Free Account'}
        </button>
      </form>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4 leading-relaxed">
        By signing up you agree to our{' '}
        <Link href="/terms" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms</Link>
        {' '}and{' '}
        <Link href="/privacy-policy" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</Link>.
      </p>

      <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
        Already have an account?{' '}
        <Link href={loginHref} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}
