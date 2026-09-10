import type { Deck, LoadedDeck } from './types';
import { parseDeck } from './parseDeck';
import { migrateDeck } from './migrate';
import { buildSlugIndex } from './slugIndex';

/**
 * raw JSON -> validated (dev) / cast (prod) -> migrated -> slug index.
 * The engine stops here: scene-`data` validation against scene-type schemas is the
 * scenes layer's job (src/scenes/validateDeck.ts).
 */
export function loadDeck(raw: unknown): LoadedDeck {
  const deck: Deck = migrateDeck(parseDeck(raw));
  const { slugToIndex, order } = buildSlugIndex(deck.scenes, deck.meta.redirects);
  return {
    meta: deck.meta,
    scenes: deck.scenes,
    slugToIndex,
    order,
  };
}
