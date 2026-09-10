import type { NavState } from './machine';

export const canPrev = (s: NavState): boolean => s.index > 0;
export const canNext = (s: NavState): boolean => s.index < s.count - 1;

/** 0..1 progress through the deck. */
export const progress = (s: NavState): number => (s.count <= 1 ? 1 : s.index / (s.count - 1));
