import { useCallback, useRef, useState } from 'react';

export type CopyState = 'idle' | 'copied' | 'failed';

/**
 * Copy-to-clipboard that is honest about failing.
 *
 * The first version called `navigator.clipboard.writeText` and swallowed the rejection in an
 * empty handler. That is the worst possible behaviour for this product: a participant
 * mid-exercise taps "העתק", nothing happens, no error appears, and they quietly fall behind
 * with no idea whether the prompt is on their clipboard or not.
 *
 * `writeText` rejects more often than it looks — an unfocused document, iOS Safari outside a
 * direct user gesture, an embedded context with a restrictive permissions policy. So:
 *
 *   1. try the async Clipboard API
 *   2. fall back to the legacy `execCommand` path, which works where (1) is blocked
 *   3. if BOTH fail, say so and select the text, so the participant can copy it by hand
 *
 * Step 3 is the point. Never leave someone staring at a button that did nothing.
 */
export function useCopy(): {
  state: CopyState;
  copy: (text: string, selectOnFail?: HTMLElement | null) => void;
} {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const settle = useCallback((next: CopyState) => {
    setState(next);
    if (timer.current) clearTimeout(timer.current);
    // A failure stays up longer: it asks the reader to do something.
    timer.current = setTimeout(() => setState('idle'), next === 'failed' ? 4000 : 1600);
  }, []);

  const copy = useCallback(
    (text: string, selectOnFail?: HTMLElement | null) => {
      const fallback = () => {
        if (legacyCopy(text)) {
          settle('copied');
          return;
        }
        selectText(selectOnFail);
        settle('failed');
      };

      if (!navigator.clipboard?.writeText) {
        fallback();
        return;
      }
      navigator.clipboard.writeText(text).then(() => settle('copied'), fallback);
    },
    [settle],
  );

  return { state, copy };
}

/** The pre-Clipboard-API path. Still the only one that works in several real browsers. */
function legacyCopy(text: string): boolean {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    // Off-screen rather than hidden: a `display:none` textarea cannot be selected.
    ta.style.cssText = 'position:fixed;inset-block-start:-9999px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** Last resort: put the text under the reader's own selection so ctrl/cmd-C works. */
function selectText(el?: HTMLElement | null): void {
  if (!el) return;
  try {
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  } catch {
    /* selection is a nicety; the visible failure state is the real fix */
  }
}

export const COPY_LABEL: Record<CopyState, string> = {
  idle: '⧉ העתק',
  copied: '✓ הועתק',
  failed: '⚠ בחרו והעתיקו ידנית',
};
