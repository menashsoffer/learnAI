import { useEffect, type ReactNode } from 'react';
import { storage } from '@/persistence/storage';
import { globalKey } from '@/persistence/namespace';
import { KEYS } from '@/persistence/keys';

interface ThemeProviderProps {
  locale: string;
  dir: 'rtl' | 'ltr';
  /** Brand kit id — reserved for M2's multi-kit swap. */
  brandKit?: string;
  children: ReactNode;
}

/**
 * Owns the document-level concerns: lang/dir, brand-kit data attribute, and the `.fx-low`
 * weak-GPU / reduced-transparency fallback class.
 */
export function ThemeProvider({
  locale,
  dir,
  brandKit = 'dark-blue',
  children,
}: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = dir;
    root.dataset.brand = brandKit;
  }, [locale, dir, brandKit]);

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
