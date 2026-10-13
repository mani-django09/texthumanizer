import type { Metadata } from 'next';
import LegalPage, { LegalSection } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Text Humanizer privacy policy. Learn how we handle your data.',
  alternates: { canonical: '/privacy-policy' },
  robots: { index: false, follow: false },
};

const UL = 'list-disc pl-5 space-y-2 marker:text-slate-300 dark:marker:text-slate-600';

const sections: LegalSection[] = [
  {
    heading: 'Information We Collect',
    body: (
      <>
        <p>We collect the minimum information necessary to operate the service:</p>
        <ul className={UL}>
          <li><strong>Text input (guests):</strong> If you use the tools without an account, your submitted text is sent to our AI provider for processing and is not stored in our database afterward.</li>
          <li><strong>Text input (registered users):</strong> If you&apos;re signed in, we save your input and output text to your account history so you can revisit past results. You can delete individual entries from your dashboard at any time.</li>
          <li><strong>Account information:</strong> If you create an account, we store your name, email address, and (for email/password accounts) a securely hashed password. If you sign in with Google, we store the name and email provided by Google.</li>
          <li><strong>Usage activity:</strong> We log account events (sign-ups, logins, logouts, and tool requests) along with word counts and timestamps, to operate the service and detect abuse.</li>
          <li><strong>IP addresses:</strong> We log IP addresses for rate limiting and abuse prevention purposes.</li>
        </ul>
      </>
    ),
  },
  {
    heading: 'How We Use Your Information',
    body: (
      <>
        <p>We use the information collected to:</p>
        <ul className={UL}>
          <li>Process your humanize, grammar, plagiarism and AI-detection requests</li>
          <li>Authenticate you and keep your account secure</li>
          <li>Maintain your saved history, if you&apos;re signed in</li>
          <li>Enforce rate limits to ensure fair usage</li>
          <li>Monitor and improve service performance</li>
          <li>Prevent abuse and maintain security</li>
        </ul>
      </>
    ),
  },
  {
    heading: 'Data Storage and Retention',
    body: (
      <p>
        Guest text is processed in real time and is not stored in our database. Registered users&apos; history is
        retained until they delete it or close their account. Account and activity data is retained for as long
        as the account is active.
      </p>
    ),
  },
  {
    heading: 'Third-Party Services',
    body: (
      <>
        <p>We use the following third-party services:</p>
        <ul className={UL}>
          <li><strong>AI providers:</strong> Your text is processed through third-party AI APIs (Google Gemini, Groq, or OpenAI) to generate output. Please review their respective privacy policies.</li>
          <li>
            <strong>Google Sign-In:</strong> If you choose to sign in with Google, we receive your name and email
            address from Google to create or match your account. Review{' '}
            <a href="https://policies.google.com/privacy" className="text-blue-600 dark:text-blue-400 font-medium hover:underline" target="_blank" rel="noopener noreferrer">
              Google&apos;s privacy policy
            </a>.
          </li>
          <li><strong>Web search:</strong> The plagiarism checker sends sampled sentences from your text to a web search API to look for matches. Only those sampled sentences are sent, not your full document.</li>
          <li>
            <strong>Google Analytics:</strong> We use Google Analytics to understand how the site is used (pages visited,
            device and country, approximate traffic sources). It does not receive the text you enter into our tools. Review{' '}
            <a href="https://policies.google.com/technologies/partner-sites" className="text-blue-600 dark:text-blue-400 font-medium hover:underline" target="_blank" rel="noopener noreferrer">
              how Google uses data from sites that use its services
            </a>.
          </li>
          <li>
            <strong>Google Ads:</strong> We advertise on Google and use the Google Ads tag to measure whether an ad
            led to a visit or sign-up and to show relevant ads to people who visited our site. It does not receive
            the text you enter into our tools. You can manage ad personalization in{' '}
            <a href="https://adssettings.google.com" className="text-blue-600 dark:text-blue-400 font-medium hover:underline" target="_blank" rel="noopener noreferrer">
              Google&apos;s Ads Settings
            </a>.
          </li>
          <li><strong>Payments:</strong> Paid plans are processed by Lemon Squeezy, which acts as the merchant of record. We never see or store your card details.</li>
        </ul>
      </>
    ),
  },
  {
    heading: 'Cookies',
    body: (
      <>
        <p>We use the following cookies:</p>
        <ul className={UL}>
          <li><strong>Essential:</strong> one cookie to keep you signed in.</li>
          <li><strong>Analytics:</strong> Google Analytics sets cookies (such as <code>_ga</code>) to distinguish visitors and sessions.</li>
          <li><strong>Advertising:</strong> The Google Ads tag sets cookies (such as <code>_gcl_*</code>) used to measure ad performance and for remarketing.</li>
        </ul>
        <p>You can block or delete these cookies in your browser settings, opt out of analytics with the <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 dark:text-blue-400 font-medium hover:underline" target="_blank" rel="noopener noreferrer">Google Analytics opt-out add-on</a>, or turn off ad personalization in Google&apos;s Ads Settings; the site keeps working either way.</p>
      </>
    ),
  },
  {
    heading: 'Your Rights',
    body: (
      <p>
        If you have an account, you can access and delete your saved history at any time from your dashboard.
        To request deletion of your account and all associated data, contact us at{' '}
        <a href="mailto:privacy@texthumanizer.site" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          privacy@texthumanizer.site
        </a>{' '}
        and we&apos;ll process your request promptly.
      </p>
    ),
  },
  {
    heading: 'Changes to This Policy',
    body: (
      <p>
        We may update this privacy policy from time to time. Changes will be reflected by updating the date at
        the top of this page.
      </p>
    ),
  },
  {
    heading: 'Contact',
    body: (
      <p>
        If you have questions about this privacy policy, please contact us at{' '}
        <a href="mailto:privacy@texthumanizer.site" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
          privacy@texthumanizer.site
        </a>.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="September 18, 2026"
      intro="How we collect, use, and protect your information — written in plain language, without the legal padding."
      sections={sections}
    />
  );
}
