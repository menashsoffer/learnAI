/**
 * Hash helpers. React Router's `createHashRouter` owns routing; these are the single
 * formatters + a legacy parser for the NotFound bounce.
 */

export const playerPath = (deckId: string, slug: string): string => `/d/${deckId}/${slug}`;
export const presenterPath = (deckId: string, slug: string): string =>
  `/d/${deckId}/presenter/${slug}`;

export interface LegacyHash {
  /** Bare 1-based scene number from the pre-platform deck ("#/7"). */
  legacyIndex?: number;
}

/** Parse a raw `location.hash` for the legacy `#/<n>` form only. */
export function parseLegacyHash(hash: string): LegacyHash {
  const m = /^#\/(\d+)\/?$/.exec(hash.trim());
  if (!m) return {};
  return { legacyIndex: Number.parseInt(m[1], 10) };
}
