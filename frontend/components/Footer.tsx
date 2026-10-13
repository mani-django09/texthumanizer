import Link from 'next/link';

const footerLinks = {
  tool: [
    { href: '/ai-humanizer',       label: 'AI Humanizer Tool' },
    { href: '/grammar-checker',    label: 'Grammar Checker' },
    { href: '/plagiarism-checker', label: 'Plagiarism Checker' },
    { href: '/ai-detector',        label: 'AI Content Detector' },
    { href: '/pricing',            label: 'Pricing' },
  ],
  company: [
    { href: '/about',     label: 'About Us' },
    { href: '/blog',      label: 'Blog' },
    { href: '/affiliate', label: 'Affiliate Program' },
    { href: '/contact',   label: 'Contact' },
  ],
  legal: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms',          label: 'Terms of Service' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
                  <path d="M21.5 7.5c-4.8 0-9 3.9-10.3 9.3-.3 1.2-.5 2.5-.5 3.8 1.3 0 2.6-.2 3.8-.5 5.4-1.3 9.3-5.5 9.3-10.3 0-.8-.1-1.5-.3-2.3-.7-.2-1.4-.3-2-.3z" fill="#fff" fillOpacity="0.96"/>
                  <path d="M14 18c-2 2-3 4-3.2 6.2" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M23 6.2l.55 1.35 1.35.55-1.35.55-.55 1.35-.55-1.35-1.35-.55 1.35-.55L23 6.2z" fill="#fff"/>
                </svg>
              </div>
              <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">Text Humanizer</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
              Transform AI-generated text into natural, human-sounding content instantly.
              Free, fast, and privacy-friendly.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-full font-medium border border-green-200 dark:border-green-800/60">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"/>
                Free to use
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full font-medium border border-blue-200 dark:border-blue-800/60">
                No signup needed
              </span>
            </div>
          </div>

          {/* Tool Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Tools</h3>
            <ul className="space-y-2.5">
              {footerLinks.tool.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            © {currentYear} Text Humanizer. All rights reserved.
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Made with ♥ for writers, students, and content creators
          </p>
        </div>
      </div>
    </footer>
  );
}
