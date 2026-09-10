import { describe, it, expect } from 'vitest';
import { buildSlugIndex, resolveSlug } from './slugIndex';

const idx = buildSlugIndex(
  [{ slug: 'intro' }, { slug: 'how-it-works' }, { slug: 'closing' }],
  { 'old-intro': 'intro', 'chain-a': 'chain-b', 'chain-b': 'closing' },
);

describe('resolveSlug', () => {
  it('resolves a direct slug', () => {
    expect(resolveSlug('how-it-works', idx)).toEqual({
      index: 1,
      canonicalSlug: 'how-it-works',
      rewritten: false,
    });
  });

  it('follows a single redirect', () => {
    expect(resolveSlug('old-intro', idx)).toEqual({
      index: 0,
      canonicalSlug: 'intro',
      rewritten: true,
    });
  });

  it('follows a redirect chain', () => {
    expect(resolveSlug('chain-a', idx)).toEqual({
      index: 2,
      canonicalSlug: 'closing',
      rewritten: true,
    });
  });

  it('resolves a legacy 1-based numeric ref', () => {
    expect(resolveSlug('2', idx)).toEqual({
      index: 1,
      canonicalSlug: 'how-it-works',
      rewritten: true,
    });
  });

  it('returns null for unknown / out-of-range', () => {
    expect(resolveSlug('nope', idx)).toBeNull();
    expect(resolveSlug('99', idx)).toBeNull();
    expect(resolveSlug('0', idx)).toBeNull();
  });
});
