import type { NavState } from './machine';

export const canPrev = (s: NavState): boolean => s.index > 0 || s.phase > 0;
export const canNext = (s: NavState): boolean => s.index < s.count - 1 || s.phase < s.maxPhase;

/** 1-based position for chrome ("3 / 23"). */
export const humanPosition = (s: NavState): { current: number; total: number } => ({
  current: s.index + 1,
  total: s.count,
});

/** 0..1 progress through the deck. */
export const progress = (s: NavState): number =>
  s.count <= 1 ? 1 : s.index / (s.count - 1);

/** Indices to keep mounted (active ± 1) — the rest render as light placeholders. */
export const mountedWindow = (s: NavState): number[] => {
  const out: number[] = [];
  for (let i = s.index - 1; i <= s.index + 1; i += 1) {
    if (i >= 0 && i < s.count) out.push(i);
  }
  return out;
};
