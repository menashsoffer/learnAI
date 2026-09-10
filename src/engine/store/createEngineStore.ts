import { createStore, type StoreApi } from 'zustand/vanilla';
import { navReducer, initialNavState, type NavAction, type NavState } from '../navigation/machine';

/**
 * Framework-light store: a `zustand/vanilla` wrapper around the pure nav reducer.
 * `zustand/vanilla` has no React dependency, so this stays inside `engine/`.
 * React binds via `useStore(store, selector)` in `src/react/`.
 */
export interface EngineState extends NavState {
  deckId: string;
  /** Canonical slugs in deck order. */
  order: string[];
  /** Derived: `order[index]`. Kept in state for a cheap selector + hash sync. */
  slug: string;
  dispatch: (action: NavAction) => void;
}

export type EngineStore = StoreApi<EngineState>;

export interface EngineStoreOptions {
  deckId: string;
  order: string[];
  startIndex?: number;
}

export function createEngineStore(opts: EngineStoreOptions): EngineStore {
  const { deckId, order } = opts;
  const startIndex = clampIndex(opts.startIndex ?? 0, order.length);

  return createStore<EngineState>((set, get) => ({
    ...initialNavState(order.length, startIndex),
    deckId,
    order,
    slug: order[startIndex] ?? order[0] ?? '',
    dispatch: (action) => {
      const prev = get();
      const nextNav = navReducer(prev, action);
      if (nextNav === prev) return;
      const slug = order[nextNav.index] ?? prev.slug;
      set({ ...nextNav, slug });
    },
  }));
}

function clampIndex(i: number, len: number): number {
  return Math.min(Math.max(0, i), Math.max(0, len - 1));
}
