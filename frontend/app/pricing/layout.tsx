import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing – Text Humanizer Plans & Features',
  description:
    'Simple, transparent pricing for Text Humanizer. Basic, Pro, and Unlimited plans starting at $9/month. Cancel anytime, save up to 39% yearly.',
  alternates: { canonical: '/pricing' },
  openGraph: {
    title: 'Pricing – Text Humanizer Plans',
    description: 'Simple, transparent pricing. Plans starting at $9/month. Cancel anytime.',
    url: '/pricing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing – Text Humanizer Plans',
    description: 'Simple, transparent pricing. Plans starting at $9/month. Cancel anytime.',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
