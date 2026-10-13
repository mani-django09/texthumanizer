'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const CHANNELS = [
  {
    tone: 'icon-box-blue',
    title: 'Email us',
    text: 'The fastest way to reach a human.',
    action: { label: 'hello@texthumanizer.site', href: 'mailto:hello@texthumanizer.site' },
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    ),
  },
  {
    tone: 'icon-box-violet',
    title: 'Check the FAQs',
    text: 'Most questions are already answered on our tool pages.',
    action: { label: 'Browse the AI Humanizer FAQ', href: '/ai-humanizer' },
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    tone: 'icon-box-green',
    title: 'Privacy requests',
    text: 'Account or data deletion requests go here.',
    action: { label: 'privacy@texthumanizer.site', href: 'mailto:privacy@texthumanizer.site' },
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    ),
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'We could not send your message. Please try again.');
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof TypeError
          ? 'Could not reach the server. Please check your connection, or email us directly.'
          : err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <PageHero
        title="Get in"
        highlight="touch"
        subtitle="Questions, feedback, bug reports, or partnership ideas — we read every message that comes in."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-start">

          {/* ── Channels ── */}
          <aside className="lg:col-span-2 space-y-4">
            {CHANNELS.map((c) => (
              <div key={c.title} className="card-hover p-5 flex gap-4">
                <div className={`${c.tone} w-10 h-10 rounded-xl flex-shrink-0`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{c.icon}</svg>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 dark:text-white text-sm mb-0.5">{c.title}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-2">{c.text}</p>
                  {c.action.href.startsWith('mailto:') ? (
                    <a href={c.action.href} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline break-all">
                      {c.action.label}
                    </a>
                  ) : (
                    <Link href={c.action.href} className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      {c.action.label} →
                    </Link>
                  )}
                </div>
              </div>
            ))}

            <div className="card-premium p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="font-bold text-slate-800 dark:text-white text-sm">All systems operational</p>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                Tools running normally. If something looks broken on your end, send us the details and we&apos;ll dig in.
              </p>
            </div>
          </aside>

          {/* ── Form ── */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="glass-card p-8 sm:p-10 text-center animate-fade-in">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-5 shadow-glow-sm">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Message sent</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-7 leading-relaxed max-w-sm mx-auto">
                  Thanks for reaching out, {form.name}. We typically respond within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="btn-secondary text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="glass-card p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="label-base">Name *</label>
                      <input
                        type="text" id="name" name="name" required
                        value={form.name} onChange={handleChange}
                        placeholder="Your name" autoComplete="name"
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="label-base">Email *</label>
                      <input
                        type="email" id="email" name="email" required
                        value={form.email} onChange={handleChange}
                        placeholder="you@example.com" autoComplete="email"
                        className="input-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="label-base">Subject *</label>
                    <select
                      id="subject" name="subject" required
                      value={form.subject} onChange={handleChange}
                      className="input-base"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Question</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="billing">Billing / Account</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="label-base">Message *</label>
                    <textarea
                      id="message" name="message" required rows={6} minLength={10} maxLength={5000}
                      value={form.message} onChange={handleChange}
                      placeholder="Tell us how we can help…"
                      className="textarea-base"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/60 rounded-xl text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  )}

                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 justify-center font-bold gap-2.5">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending…
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
