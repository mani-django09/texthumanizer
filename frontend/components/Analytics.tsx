// Both IDs are public (visible in every page's source), so defaults are safe and a
// build without the env vars still tracks.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-S5EBVTQMDK';
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-18396878000';

// Google wants exactly one gtag.js per page: load it once, then `config` each product.
// Ads first so the loader URL matches the snippet Google Ads verifies against.
const IDS = [ADS_ID, GA_ID].filter(Boolean);

/**
 * Must be rendered inside <head>. These are plain server-rendered <script> tags
 * (not next/script) on purpose: Google Ads' "tag detected" check reads the raw
 * HTML, and next/script injects the loader at runtime, so it never saw the tag.
 */
export default function Analytics() {
  if (IDS.length === 0) return null;

  const init = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
${IDS.map((id) => `gtag('config', '${id}');`).join('\n')}`;

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${IDS[0]}`} />
      <script dangerouslySetInnerHTML={{ __html: init }} />
    </>
  );
}
