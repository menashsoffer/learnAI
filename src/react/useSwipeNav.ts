import { useEffect } from 'react';
import { usePresentationContext } from './PresentationProvider';

const THRESHOLD = 50;
const EDITABLE = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/**
 * Touch swipe on the presentation viewport.
 * RTL: swipe left -> next, swipe right -> prev (matches the keyboard mapping).
 */
export function useSwipeNav(target: HTMLElement | null, enabled = true): void {
  const { store } = usePresentationContext();

  useEffect(() => {
    if (!enabled || !target) return;
    let startX = 0;
    let startY = 0;

    const onStart = (e: TouchEvent) => {
      startX = e.changedTouches[0].screenX;
      startY = e.changedTouches[0].screenY;
    };
    const onEnd = (e: TouchEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (EDITABLE.has(el.tagName) || el.isContentEditable)) return;
      const dx = e.changedTouches[0].screenX - startX;
      const dy = e.changedTouches[0].screenY - startY;
      if (Math.abs(dx) < THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      store.getState().dispatch({ type: dx < 0 ? 'next' : 'prev' });
    };

    target.addEventListener('touchstart', onStart, { passive: true });
    target.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      target.removeEventListener('touchstart', onStart);
      target.removeEventListener('touchend', onEnd);
    };
  }, [store, target, enabled]);
}
