import { useEffect } from 'react';
import { usePresentationContext } from './PresentationProvider';

const EDITABLE = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/**
 * RTL-aware keyboard navigation:
 *   ArrowLeft / Space / PageDown -> next     (visually forward in RTL)
 *   ArrowRight / PageUp          -> prev
 *   Esc -> toggle grid overlay (closes any open overlay first)
 *   N   -> toggle presenter notes
 *   F   -> toggle fullscreen
 */
export function useKeyboardNav(enabled = true): void {
  const { store } = usePresentationContext();

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (EDITABLE.has(el.tagName) || el.isContentEditable)) return;
      const { dispatch, overlay } = store.getState();

      switch (e.key) {
        case 'ArrowLeft':
        case 'PageDown':
        case ' ':
        case 'Spacebar':
          e.preventDefault();
          dispatch({ type: 'next' });
          break;
        case 'ArrowRight':
        case 'PageUp':
          e.preventDefault();
          dispatch({ type: 'prev' });
          break;
        case 'Escape':
          e.preventDefault();
          if (overlay !== 'none') dispatch({ type: 'setOverlay', overlay: 'none' });
          else dispatch({ type: 'toggleOverlay', overlay: 'grid' });
          break;
        case 'n':
        case 'N':
        case 'מ': // same physical key on a Hebrew layout
          e.preventDefault();
          dispatch({ type: 'toggleOverlay', overlay: 'notes' });
          break;
        case 'f':
        case 'F':
        case 'כ':
          e.preventDefault();
          void toggleFullscreen();
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [store, enabled]);
}

export async function toggleFullscreen(): Promise<void> {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    /* fullscreen denied — non-fatal */
  }
}
