/** Single source of truth for the site's canonical origin. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://texthumanizer.site';

export const SITE_NAME = 'Text Humanizer';

/** Build an absolute URL from a path (e.g. abs('/humanizer')). */
export const abs = (path = '/') => new URL(path, SITE_URL).toString();

/**
 * Absolute URL to the shared dynamic OG image generator (app/opengraph/route.tsx)
 * for a given page title. Use this in a page's `openGraph.images` / `twitter.images`
 * so social previews (WhatsApp, Twitter, Slack, Facebook) always show a real card
 * instead of falling back to nothing.
 */
export function ogImage(title: string, badge?: string) {
  const params = new URLSearchParams({ title });
  if (badge) params.set('badge', badge);
  return abs(`/opengraph?${params.toString()}`);
}

/**
 * Validates a `?redirect=` value so login/signup can safely send the user
 * back where they came from. Only same-site relative paths are accepted —
 * this blocks open-redirect payloads like `//evil.com` or absolute URLs,
 * and never bounces the user back onto the auth pages themselves.
 */
export function safeRedirect(target: string | null | undefined, fallback = '/dashboard') {
  if (!target) return fallback;
  if (!target.startsWith('/') || target.startsWith('//')) return fallback;
  if (target === '/login' || target === '/signup') return fallback;
  return target;
}

/** Appends the current path as a `?redirect=` param, unless it's the auth pages themselves. */
export function withRedirectParam(href: string, currentPath: string) {
  if (currentPath === '/login' || currentPath === '/signup') return href;
  const separator = href.includes('?') ? '&' : '?';
  return `${href}${separator}redirect=${encodeURIComponent(currentPath)}`;
}
