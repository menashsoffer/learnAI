import type { SceneRecord } from './types';

export interface SlugIndex {
  slugToIndex: Map<string, number>;
  order: string[];
  redirects: Record<string, string>;
}

export interface SlugResolution {
  index: number;
  /** The canonical slug for this position (may differ from the requested one). */
  canonicalSlug: string;
  /** True when the requested key was a redirect source or a legacy numeric ref. */
  rewritten: boolean;
}

export function buildSlugIndex(
  scenes: Pick<SceneRecord, 'slug'>[],
  redirects: Record<string, string> = {},
): SlugIndex {
  const slugToIndex = new Map<string, number>();
  const order: string[] = [];
  scenes.forEach((s, i) => {
    slugToIndex.set(s.slug, i);
    order.push(s.slug);
  });
  return { slugToIndex, order, redirects };
}

/**
 * Resolve any hash slug to a scene position:
 *  1. direct slug hit
 *  2. redirect (oldSlug -> newSlug), possibly chained
 *  3. legacy 1-based numeric ref ("#/7" from the pre-platform deck)
 * Returns null for anything unresolvable (caller bounces to the first scene + toast).
 */
export function resolveSlug(raw: string, idx: SlugIndex): SlugResolution | null {
  if (idx.slugToIndex.has(raw)) {
    return { index: idx.slugToIndex.get(raw)!, canonicalSlug: raw, rewritten: false };
  }

  let cursor = raw;
  const guard = new Set<string>();
  while (idx.redirects[cursor] && !guard.has(cursor)) {
    guard.add(cursor);
    cursor = idx.redirects[cursor];
    if (idx.slugToIndex.has(cursor)) {
      return { index: idx.slugToIndex.get(cursor)!, canonicalSlug: cursor, rewritten: true };
    }
  }

  if (/^\d+$/.test(raw)) {
    const n = Number.parseInt(raw, 10) - 1;
    if (n >= 0 && n < idx.order.length) {
      return { index: n, canonicalSlug: idx.order[n], rewritten: true };
    }
  }

  return null;
}
