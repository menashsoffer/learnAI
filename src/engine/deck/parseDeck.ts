import type { Deck } from './types';
import { deckSchema } from './schema';

/**
 * DEV / build / test: full Zod parse (rich errors, slug-uniqueness, redirect collisions).
 * PROD (offline artifact): the deck JSON was validated at build time and inlined, so a plain
 * cast plus cheap asserts suffice. The `import.meta.env.DEV` guard is statically false in the
 * prod build, so Rollup drops this branch and tree-shakes Zod out (invariant #5).
 */
const IS_DEV =
  typeof import.meta !== 'undefined' &&
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (import.meta as any).env?.DEV !== false;

export function parseDeck(raw: unknown): Deck {
  if (IS_DEV) {
    return deckSchema.parse(raw) as Deck;
  }
  return castDeck(raw);
}

function castDeck(raw: unknown): Deck {
  const deck = raw as Deck;
  if (!deck || typeof deck !== 'object') throw new Error('deck: not an object');
  if (!deck.meta || typeof deck.meta.id !== 'string') throw new Error('deck.meta.id missing');
  if (!Array.isArray(deck.scenes) || deck.scenes.length === 0) {
    throw new Error('deck.scenes must be a non-empty array');
  }
  const seen = new Set<string>();
  for (const s of deck.scenes) {
    if (!s || typeof s.slug !== 'string' || !s.slug) throw new Error('scene.slug missing');
    if (seen.has(s.slug)) throw new Error(`duplicate slug "${s.slug}"`);
    seen.add(s.slug);
  }
  return deck;
}
