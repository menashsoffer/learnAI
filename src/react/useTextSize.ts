import { useCallback, useEffect, useState } from 'react';
import { storage } from '@/persistence/storage';
import { globalKey } from '@/persistence/namespace';

export type TextSize = 's' | 'm' | 'l';
const KEY = globalKey('textSize');
const SIZES: TextSize[] = ['s', 'm', 'l'];

/** Per-device text scale (TV vs phone differ). Applied as data-text-size on <html>. */
export function useTextSize(): {
  size: TextSize;
  setSize: (s: TextSize) => void;
  cycle: () => void;
} {
  const [size, setSizeState] = useState<TextSize>(() => {
    const s = storage.getString(KEY);
    return s === 's' || s === 'l' ? s : 'm';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (size === 'm') root.removeAttribute('data-text-size');
    else root.setAttribute('data-text-size', size);
  }, [size]);

  const setSize = useCallback((s: TextSize) => {
    setSizeState(s);
    storage.setString(KEY, s);
  }, []);

  const cycle = useCallback(() => {
    setSizeState((cur) => {
      const next = SIZES[(SIZES.indexOf(cur) + 1) % SIZES.length];
      storage.setString(KEY, next);
      return next;
    });
  }, []);

  return { size, setSize, cycle };
}
