'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthContext';
import { withRedirectParam } from '@/lib/site';

const navLinks = [
  { href: '/ai-humanizer',    label: 'AI Humanizer' },
  { href: '/grammar-checker', label: 'Grammar Checker' },
  { href: '/pricing',         label: 'Pricing' },
  { href: '/blog',            label: 'Blog' },
  { href: '/contact',         label: 'Contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const loginHref = withRedirectParam('/login', pathname);
  const signupHref = withRedirectParam('/signup', pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-card-md border-b border-slate-200/60 dark:border-slate-700/40'
        : 'bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px]">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-glow-xs group-hover:shadow-glow-sm transition-all duration-300 group-hover:scale-105">
                <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                  <path d="M21.5 7.5c-4.8 0-9 3.9-10.3 9.3-.3 1.2-.5 2.5-.5 3.8 1.3 0 2.6-.2 3.8-.5 5.4-1.3 9.3-5.5 9.3-10.3 0-.8-.1-1.5-.3-2.3-.7-.2-1.4-.3-2-.3z" fill="#fff" fillOpacity="0.96"/>
                  <path d="M14 18c-2 2-3 4-3.2 6.2" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M23 6.2l.55 1.35 1.35.55-1.35.55-.55 1.35-.55-1.35-1.35-.55 1.35-.55L23 6.2z" fill="#fff"/>
                </svg>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-950 animate-pulse"/>
            </div>
            <span className="font-black text-[16px] text-slate-900 dark:text-white tracking-tight">Text Humanizer</span>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300
                           hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-950/40
                           rounded-xl transition-all duration-200 relative group">
                {link.label}
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 group-hover:w-4 h-0.5 bg-blue-500 rounded-full transition-all duration-300"/>
              </Link>
            ))}
          </div>

          {/* ── Right Actions ── */}
          <div className="flex items-center gap-2.5">
            {!loading && (
              user ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/dashboard"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 transition-all duration-200">
                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    {user.name.split(' ')[0]}
                  </Link>
                  <button onClick={logout} className="btn-ghost text-sm py-2 px-3">
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href={loginHref} className="btn-ghost text-sm py-2.5 px-4">
                    Log In
                  </Link>
                  <Link href={signupHref}
                    className="btn-primary text-sm py-2.5 px-5 gap-1.5 btn-glow">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    Try Free
                  </Link>
                </div>
              )
            )}

            <button className="md:hidden p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div className="md:hidden pb-5 border-t border-slate-200/60 dark:border-slate-700/40 pt-3 animate-fade-in">
            <div className="flex flex-col gap-1 mb-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium
                             py-3 px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30
                             transition-all duration-200 text-sm"
                  onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </div>
            <Link href="/ai-humanizer" onClick={() => setMenuOpen(false)}
              className="btn-primary w-full text-center text-sm py-3 justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Humanize Text — It&apos;s Free
            </Link>

            {!loading && (
              user ? (
                <div className="flex flex-col gap-2 mt-3">
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200 text-sm">
                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    Dashboard
                  </Link>
                  <button onClick={() => { setMenuOpen(false); logout(); }}
                    className="text-left text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-medium py-3 px-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 text-sm">
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-3">
                  <Link href={loginHref} onClick={() => setMenuOpen(false)}
                    className="text-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200 text-sm border border-slate-200 dark:border-slate-700">
                    Log In
                  </Link>
                  <Link href={signupHref} onClick={() => setMenuOpen(false)}
                    className="text-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-3 px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200 text-sm">
                    Create an account
                  </Link>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
