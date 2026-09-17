import { useLayoutEffect } from 'react';

/**
 * The fixed bars own their strip of the screen; the scene never scrolls underneath them.
 *
 * Their heights are not constants — the stage name wraps, the text-size control scales every
 * rem, the presenter drawer opens — so a padding guessed in CSS was always wrong by some
 * amount, and whatever sat in that amount was hidden behind a bar. Instead, measure the bars
 * that are actually on screen and publish the result as `--inset-top` / `--inset-bottom`,
 * which `.viewport` reads. Nothing sits under a bar because the stage simply ends where it
 * starts.
 */
const TOP = ['.topbar', '.stagebar', '.chrome-strip'];
const BOTTOM = ['.studentnav', '.guide'];

export function useChromeInsets(): void {
  useLayoutEffect(() => {
    const root = document.documentElement;

    const edge = (selectors: string[], side: 'top' | 'bottom') => {
      let px = 0;
      for (const sel of selectors) {
        const el = document.querySelector<HTMLElement>(sel);
        if (!el || getComputedStyle(el).display === 'none') continue;
        const box = el.getBoundingClientRect();
        px = side === 'top' ? Math.max(px, box.bottom) : Math.max(px, window.innerHeight - box.top);
      }
      return Math.max(0, Math.round(px));
    };

    const apply = () => {
      root.style.setProperty('--inset-top', `${edge(TOP, 'top')}px`);
      root.style.setProperty('--inset-bottom', `${edge(BOTTOM, 'bottom')}px`);
    };

    const ro = new ResizeObserver(apply);
    const observeAll = () => {
      ro.disconnect();
      for (const sel of [...TOP, ...BOTTOM]) {
        document.querySelectorAll(sel).forEach((el) => ro.observe(el));
      }
      apply();
    };

    // Bars mount and unmount (the drawer body, the stage strip at a breakpoint), so re-scan
    // when the chrome's children change, not only when a known bar resizes.
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', apply);
    observeAll();

    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('resize', apply);
      root.style.removeProperty('--inset-top');
      root.style.removeProperty('--inset-bottom');
    };
  }, []);
}
