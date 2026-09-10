import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePresentationContext } from './PresentationProvider';
import { reconcile, playerPath } from '@/engine';

/**
 * The single source of truth: the engine store owns `slug` and NEVER writes the hash.
 * This hook is the only place the two are reconciled — via the pure `reconcile()` decision,
 * with no setTimeout guards.
 */
export function useHashSync(routerSlug: string | undefined, onUnknown?: () => void): void {
  const { store, deck, slugIndex } = usePresentationContext();
  const navigate = useNavigate();

  // Router -> store  (shared link, back button, redirect / legacy-numeric canonicalisation)
  useEffect(() => {
    const { slug: storeSlug, dispatch } = store.getState();
    const result = reconcile({ routerSlug, storeSlug, index: slugIndex });
    if (result.action === 'store') {
      dispatch({ type: 'goToIndex', index: result.index });
    } else if (result.action === 'navigate') {
      if (result.reason === 'unknown') onUnknown?.();
      navigate(playerPath(deck.meta.id, result.slug), { replace: true });
    }
  }, [routerSlug, store, deck.meta.id, slugIndex, navigate, onUnknown]);

  // Store -> router  (keyboard / swipe / grid moved the active scene)
  useEffect(
    () =>
      store.subscribe((state, prev) => {
        if (state.slug !== prev.slug) {
          navigate(playerPath(deck.meta.id, state.slug), { replace: true });
        }
      }),
    [store, deck.meta.id, navigate],
  );
}
