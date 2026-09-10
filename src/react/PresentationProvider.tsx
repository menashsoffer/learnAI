import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import { useStore } from 'zustand';
import {
  createEngineStore,
  attachPersistence,
  buildSlugIndex,
  type EngineStore,
  type EngineState,
  type LoadedDeck,
  type SlugIndex,
} from '@/engine';

export type PlayerMode = 'plain' | 'present' | 'study';

interface PresentationContextValue {
  store: EngineStore;
  deck: LoadedDeck;
  slugIndex: SlugIndex;
  mode: PlayerMode;
}

const Ctx = createContext<PresentationContextValue | null>(null);

export function PresentationProvider({
  deck,
  startIndex = 0,
  persist = true,
  mode = 'plain',
  children,
}: {
  deck: LoadedDeck;
  startIndex?: number;
  persist?: boolean;
  mode?: PlayerMode;
  children: ReactNode;
}) {
  // One store per deck instance. deck.meta.id is the stable identity.
  const storeRef = useRef<EngineStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createEngineStore({
      deckId: deck.meta.id,
      order: deck.order,
      startIndex,
    });
  }
  const store = storeRef.current;

  useEffect(() => {
    if (!persist) return;
    return attachPersistence(store, deck.meta.id);
  }, [store, deck.meta.id, persist]);

  const value = useMemo<PresentationContextValue>(
    () => ({
      store,
      deck,
      slugIndex: buildSlugIndex(deck.scenes, deck.meta.redirects),
      mode,
    }),
    [store, deck, mode],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePresentationContext(): PresentationContextValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePresentation* must be used inside <PresentationProvider>');
  return v;
}

/** Selector-based read of engine state (re-renders only on the slice you pick). */
export function usePresentation<T>(selector: (s: EngineState) => T): T {
  const { store } = usePresentationContext();
  return useStore(store, selector);
}

export function useEngineDispatch() {
  const { store } = usePresentationContext();
  return store.getState().dispatch;
}

export function useDeck(): LoadedDeck {
  return usePresentationContext().deck;
}

export function usePlayerMode(): PlayerMode {
  return usePresentationContext().mode;
}
