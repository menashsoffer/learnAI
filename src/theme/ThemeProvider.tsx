import { useEffect, type ReactNode } from 'react';
import { storage } from '@/persistence/storage';
import { globalKey } from '@/persistence/namespace';
import { KEYS } from '@/persistence/keys';

/** Which colour roles apply. `hall` is for a darkened auditorium, opt-in by the presenter. */
export type Theme = 'light' | 'hall';

/**
 * How far the reader's eye is from this surface. Sets the type scale ONCE, for everything
 * below it — a component names a step (`--fs-500`) and inherits the right size for where it
 * is being read. See tokens/semantic.css.
 */
export type ViewingDistance = 'read' | 'glance' | 'project';

interface ThemeProviderProps {
  locale: string;
  dir: 'rtl' | 'ltr';
  /** Defaults to `project`: the deck's home is a projector. */
  distance?: ViewingDistance;
  theme?: Theme;
  children: ReactNode;
}

/**
 * Owns the document-level concerns: lang/dir, colour theme, viewing distance, and the
 * `.fx-low` weak-GPU / reduced-transparency fallback.
 *
 * (This replaces the old `brandKit` prop, which set a `data-brand` attribute that nothing
 * ever read — one palette was hard-imported, so the theme could never actually change.)
 */
export function ThemeProvider({
  locale,
  dir,
  distance = 'project',
  theme,
  children,
}: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
    root.dataset.distance = distance;
  }, [locale, dir, distance]);

  useEffect(() => {
    const root = document.documentElement;
    const stored = storage.getString(globalKey(KEYS.theme));
    const chosen = theme ?? (stored === 'hall' ? 'hall' : 'light');
    root.dataset.theme = chosen;
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    const stored = storage.getJSON<boolean | null>(globalKey(KEYS.fxLow), null);
    const mqMotion = matchMedia?.('(prefers-reduced-motion: reduce)');
    const mqTrans = matchMedia?.('(prefers-reduced-transparency: reduce)');

    const apply = () => {
      const low =
        stored === true ||
        (stored !== false && ((mqMotion?.matches ?? false) || (mqTrans?.matches ?? false)));
      root.classList.toggle('fx-low', low);
    };
    apply();
    mqMotion?.addEventListener('change', apply);
    mqTrans?.addEventListener('change', apply);
    return () => {
      mqMotion?.removeEventListener('change', apply);
      mqTrans?.removeEventListener('change', apply);
    };
  }, []);

  return <>{children}</>;
}
