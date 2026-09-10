import type { EngineStore } from './createEngineStore';
import { storage } from '../../persistence/storage';
import { deckKey } from '../../persistence/namespace';
import { KEYS } from '../../persistence/keys';

export interface PersistedLastScene {
  slug?: string;
  phase?: number;
  timerTarget?: number;
}

export function readLastScene(deckId: string): PersistedLastScene {
  return storage.getJSON<PersistedLastScene>(deckKey(deckId, KEYS.lastScene), {});
}

/**
 * Subscribe the store to localStorage: debounced writes of `{ slug, phase, timerTarget }`.
 * Returns an unsubscribe fn. Hydration is done by the caller (needs the slug index) via
 * `readLastScene` before the store is created.
 */
export function attachPersistence(store: EngineStore, deckId: string, debounceMs = 250): () => void {
  let handle: ReturnType<typeof setTimeout> | undefined;

  const flush = () => {
    const s = store.getState();
    const payload: PersistedLastScene = {
      slug: s.slug,
      phase: s.phase,
      timerTarget: s.timer.target,
    };
    storage.setJSON(deckKey(deckId, KEYS.lastScene), payload);
  };

  const unsub = store.subscribe(() => {
    if (handle) clearTimeout(handle);
    handle = setTimeout(flush, debounceMs);
  });

  return () => {
    if (handle) clearTimeout(handle);
    flush();
    unsub();
  };
}
