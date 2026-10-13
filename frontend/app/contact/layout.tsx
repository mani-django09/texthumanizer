import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us – Text Humanizer Support & Feedback',
  description:
    'Get in touch with the Text Humanizer team. Questions, feedback, or support — we reply within one business day.',
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us – Text Humanizer Support & Feedback',
    description: 'Questions, feedback, or support? We reply within one business day.',
    url: '/contact',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us – Text Humanizer Support & Feedback',
    description: 'Questions, feedback, or support? We reply within one business day.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
