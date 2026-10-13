import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import { AuthProvider } from '@/components/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';
import { SITE_URL, SITE_NAME, abs } from '@/lib/site';

const inter = Inter({ subsets: ['latin'] });

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  title: {
    template: '%s',
    default: 'AI Humanizer – Free AI Text to Human Converter',
  },
  description:
    'Transform AI-generated text into natural, human-sounding writing instantly. Free AI humanizer with five rewrite styles, a grammar checker and more. No signup required.',
  keywords: [
    'AI humanizer',
    'humanize AI text',
    'AI to human text',
    'AI text rewriter',
    'ChatGPT humanizer',
    'AI text converter',
    'make AI text human',
  ],
  openGraph: {
    title: 'AI Humanizer – Convert AI Text to Human Writing',
    description:
      'Transform AI-generated text into natural, human-sounding content instantly. Free to use.',
    url: siteUrl,
    siteName: SITE_NAME,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Humanizer – Convert AI Text to Human Writing',
    description:
      'Transform AI-generated text into natural, human-sounding content instantly.',
  },
  // Set NEXT_PUBLIC_GSC_VERIFICATION to the code from Google Search Console (HTML tag method).
  verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } : undefined,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: abs('/icon.svg'),
  description:
    'Free AI humanizer that converts AI-generated text into natural, human-sounding writing.',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      </head>
      <body
        className={`${inter.className} bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
