import { describe, it, expect } from 'vitest';
import { buildSlugIndex } from '../deck/slugIndex';
import { reconcile } from './reconcile';

const index = buildSlugIndex([{ slug: 'intro' }, { slug: 'middle' }, { slug: 'end' }], {
  'legacy-mid': 'middle',
});

describe('reconcile', () => {
  it('fills an empty route with the store slug', () => {
    expect(reconcile({ routerSlug: undefined, storeSlug: 'intro', index })).toEqual({
      action: 'navigate',
      slug: 'intro',
      reason: 'fill',
    });
  });

  it('no-ops when router and store already agree', () => {
    expect(reconcile({ routerSlug: 'middle', storeSlug: 'middle', index })).toEqual({
      action: 'noop',
    });
  });

  it('tells the store to move when the URL changed (shared link / back button)', () => {
    expect(reconcile({ routerSlug: 'end', storeSlug: 'intro', index })).toEqual({
      action: 'store',
      index: 2,
      canonicalSlug: 'end',
    });
  });

  it('canonicalises a redirect source', () => {
    expect(reconcile({ routerSlug: 'legacy-mid', storeSlug: 'intro', index })).toEqual({
      action: 'navigate',
      slug: 'middle',
      reason: 'canonicalise',
    });
  });

  it('canonicalises a legacy numeric ref', () => {
    expect(reconcile({ routerSlug: '3', storeSlug: 'intro', index })).toEqual({
      action: 'navigate',
      slug: 'end',
      reason: 'canonicalise',
    });
  });

  it('bounces an unknown slug to the store slug', () => {
    expect(reconcile({ routerSlug: 'garbage', storeSlug: 'middle', index })).toEqual({
      action: 'navigate',
      slug: 'middle',
      reason: 'unknown',
    });
  });
});
