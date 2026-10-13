import type { AuthUser } from '@/components/AuthContext';

export const GUEST_MAX_WORDS = 500;

/** Practical ceiling for plans with no per-request cap (backend JSON body limit is 1 MB). */
export const UNLIMITED_CAP = 100000;

/**
 * Per-request word limit for the current visitor. Guests and free accounts get 500;
 * paid plans get what /api/auth/me reports (null = no per-request cap). The server
 * is the source of truth — this only drives the counter and pre-submit check.
 */
export function wordLimitFor(user: AuthUser | null): { max: number; unlimited: boolean } {
  if (!user) return { max: GUEST_MAX_WORDS, unlimited: false };
  if (user.wordsPerRequest === null) return { max: UNLIMITED_CAP, unlimited: true };
  return { max: user.wordsPerRequest ?? GUEST_MAX_WORDS, unlimited: false };
}
