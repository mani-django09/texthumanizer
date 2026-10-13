import type { Metadata } from 'next';
import { abs } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Affiliate Program – Earn Commission | Text Humanizer',
  description:
    'Join the Text Humanizer affiliate program. Earn commission promoting our AI text humanizer to your audience.',
  alternates: { canonical: '/affiliate' },
  openGraph: {
    title: 'Affiliate Program – Earn Commission | Text Humanizer',
    description: 'Earn commission promoting our AI text humanizer to your audience.',
    url: abs('/affiliate'),
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Affiliate Program – Earn Commission | Text Humanizer',
    description: 'Earn commission promoting our AI text humanizer to your audience.',
  },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
