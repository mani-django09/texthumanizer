import type { Metadata } from 'next';
import LegalPage, { LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Text Humanizer terms of service. Read our terms before using the tools.',
  alternates: { canonical: '/terms' },
  robots: { index: false, follow: false },
};

const UL = 'list-disc pl-5 space-y-2 marker:text-slate-300 dark:marker:text-slate-600';

const sections: LegalSection[] = [
  {
    heading: 'Acceptance of Terms',
    body: (
      <p>
        By accessing and using Text Humanizer (&quot;the Service&quot;), you agree to be bound by these Terms of
        Service. If you do not agree to these terms, please do not use the Service.
      </p>
    ),
  },
  {
    heading: 'Description of Service',
    body: (
      <p>
        Text Humanizer provides tools that rewrite AI-generated text to sound more natural and human-written,
        check grammar, scan for web matches, and estimate how AI-like a piece of writing reads. The Service is
        provided &quot;as is&quot; and we reserve the right to modify, suspend, or discontinue it at any time.
      </p>
    ),
  },
  {
    heading: 'Acceptable Use',
    body: (
      <>
        <p>You agree not to use the Service to:</p>
        <ul className={UL}>
          <li>Generate, distribute, or facilitate illegal content</li>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe on the intellectual property rights of others</li>
          <li>Submit malicious code, spam, or harmful content</li>
          <li>Circumvent rate limits through automated means</li>
          <li>Resell or commercially exploit the Service without permission</li>
        </ul>
      </>
    ),
  },
  {
    heading: 'Accounts',
    body: (
      <p>
        You may use the Service without an account, or create a free account (via email/password or Google
        Sign-In) to save your history and track your usage. You are responsible for maintaining the
        confidentiality of your account credentials and for all activity under your account. You may delete your
        account at any time by contacting us at{' '}
        <a href="mailto:legal@texthumanizer.site" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          legal@texthumanizer.site
        </a>.
      </p>
    ),
  },
  {
    heading: 'Academic Integrity',
    body: (
      <p>
        Users are solely responsible for ensuring their use of this Service complies with the policies of their
        educational institution, employer, or any other relevant organization. Text Humanizer does not condone
        academic dishonesty.
      </p>
    ),
  },
  {
    heading: 'Accuracy of Our Checks',
    body: (
      <p>
        Our Human Score and AI Content Detector are our own statistical heuristics, not trained detection models
        or licensed third-party detectors, and our plagiarism checker samples sentences against live web search
        results rather than an exhaustive academic database. These results are informational signals only and
        should not be relied upon as proof of authorship or originality.
      </p>
    ),
  },
  {
    heading: 'Intellectual Property',
    body: (
      <p>
        You retain ownership of text you submit to the Service. The output is provided to you for your use. The
        Text Humanizer platform, branding, and software remain the property of Text Humanizer.
      </p>
    ),
  },
  {
    heading: 'Disclaimer of Warranties',
    body: (
      <p>
        The Service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee that the
        humanized text will be undetectable by all AI detection tools, or that it will meet your specific
        requirements.
      </p>
    ),
  },
  {
    heading: 'Limitation of Liability',
    body: (
      <p>
        To the maximum extent permitted by law, Text Humanizer shall not be liable for any indirect, incidental,
        special, or consequential damages arising from your use of the Service.
      </p>
    ),
  },
  {
    heading: 'Rate Limiting',
    body: (
      <p>
        We reserve the right to limit usage to ensure fair access for all users. Free use (with or without an account) is limited to 5,000 words per month and 500 words
        per request; paid plans have higher limits as described on the pricing page. We also apply reasonable per-IP
        request-rate limits to prevent abuse.
      </p>
    ),
  },
  {
    heading: 'Changes to Terms',
    body: (
      <p>
        We may modify these terms at any time. Continued use of the Service after changes constitutes acceptance
        of the new terms. The updated date at the top of this page reflects the most recent revision.
      </p>
    ),
  },
  {
    heading: 'Contact',
    body: (
      <p>
        For questions about these terms, contact us at{' '}
        <a href="mailto:legal@texthumanizer.site" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          legal@texthumanizer.site
        </a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="August 30, 2026"
      intro="The rules for using Text Humanizer — what you can expect from us, and what we expect from you."
      sections={sections}
    />
  );
}
