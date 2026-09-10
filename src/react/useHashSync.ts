import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePresentationContext } from './PresentationProvider';
import { reconcile } from '@/engine';

/**
 * The single source of truth: the engine store owns `slug` and NEVER writes the hash.
 * This hook is the only place the two are reconciled — via the pure `reconcile()` decision,
 * with no setTimeout guards. `segment` is '' | 'present' | 'study' (the mode path prefix).
 */
export function useHashSync(
  routerSlug: string | undefined,
  onUnknown?: () => void,
  segment = '',
): void {
  const { store, deck, slugIndex } = usePresentationContext();
  const navigate = useNavigate();

  const pathFor = useCallback(
    (slug: string) => {
      const mid = segment ? `/${segment}` : '';
      return `/d/${deck.meta.id}${mid}/${slug}`;
    },
    [deck.meta.id, segment],
  );

  // Router -> store  (shared link, back button, redirect / legacy-numeric canonicalisation)
  useEffect(() => {
    const { slug: storeSlug, dispatch } = store.getState();
    const result = reconcile({ routerSlug, storeSlug, index: slugIndex });
    if (result.action === 'store') {
      dispatch({ type: 'goToIndex', index: result.index });
    } else if (result.action === 'navigate') {
      if (result.reason === 'unknown') onUnknown?.();
      navigate(pathFor(result.slug), { replace: true });
    }
  }, [routerSlug, store, slugIndex, navigate, onUnknown, pathFor]);

  // Store -> router  (keyboard / swipe / grid moved the active scene)
  useEffect(
    () =>
      store.subscribe((state, prev) => {
        if (state.slug !== prev.slug) navigate(pathFor(state.slug), { replace: true });
      }),
    [store, navigate, pathFor],
  );
}
