import type { SlugIndex, SlugResolution } from '../deck/slugIndex';
import { resolveSlug } from '../deck/slugIndex';

/**
 * The single, pure decision that keeps the engine store and the router in sync WITHOUT the
 * legacy `isUpdatingHash` + setTimeout dance. The store owns `currentSlug` and never writes
 * the hash; the router effect calls this, then applies exactly one of:
 *   - noop
 *   - store  -> dispatch goToIndex(index)          (URL changed: back button, shared link)
 *   - navigate(slug, {replace:true})               (canonicalise a redirect / legacy ref, or
 *                                                    push the store's slug into an empty/bad URL)
 */
export type ReconcileResult =
  | { action: 'noop' }
  | { action: 'store'; index: number; canonicalSlug: string }
  | { action: 'navigate'; slug: string; reason: 'canonicalise' | 'unknown' | 'fill' };

export interface ReconcileInput {
  /** Slug from the current route params, or undefined on the bare deck/index route. */
  routerSlug: string | undefined;
  /** Slug the store currently considers active. */
  storeSlug: string;
  index: SlugIndex;
}

export function reconcile({ routerSlug, storeSlug, index }: ReconcileInput): ReconcileResult {
  if (routerSlug === undefined || routerSlug === '') {
    return { action: 'navigate', slug: storeSlug, reason: 'fill' };
  }

  const resolved: SlugResolution | null = resolveSlug(routerSlug, index);

  if (!resolved) {
    // Unknown slug — bounce to wherever the store is; caller shows a non-blocking toast.
    return { action: 'navigate', slug: storeSlug, reason: 'unknown' };
  }

  if (resolved.canonicalSlug !== routerSlug) {
    return { action: 'navigate', slug: resolved.canonicalSlug, reason: 'canonicalise' };
  }

  if (resolved.canonicalSlug === storeSlug) {
    return { action: 'noop' };
  }

  return { action: 'store', index: resolved.index, canonicalSlug: resolved.canonicalSlug };
}
