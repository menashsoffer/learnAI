/**
 * Deck manifest. Decks are IMPORTED (bundled + inlined), never fetched — the offline
 * artifact has no network. Add a deck = add its JSON + a line here.
 */
import aiCadets2026 from './ai-cadets-2026/deck.json';

export interface DeckManifestEntry {
  id: string;
  title: string;
  /** Synchronous because JSON is bundled; kept as a fn for a future lazy hosted split. */
  load: () => unknown;
}

export const DECKS: DeckManifestEntry[] = [
  { id: 'ai-cadets-2026', title: 'צוערים לשלטון המקומי', load: () => aiCadets2026 },
];

export const DEFAULT_DECK_ID = 'ai-cadets-2026';

export function getDeckRaw(id: string): unknown | undefined {
  return DECKS.find((d) => d.id === id)?.load();
}
