import type { Clock } from './clock';

/**
 * Wall-clock elapsed tracking for presenter mode (total + per-scene). Not wired into the
 * player until M3; kept minimal and pure here.
 */
export interface ElapsedState {
  startedAt: number | null;
  total: number;
  perScene: Record<string, number>;
  currentSlug: string | null;
  lastMark: number;
}

export const makeElapsed = (): ElapsedState => ({
  startedAt: null,
  total: 0,
  perScene: {},
  currentSlug: null,
  lastMark: 0,
});

export function startElapsed(s: ElapsedState, slug: string, clock: Clock): ElapsedState {
  const now = clock();
  return { ...s, startedAt: now, lastMark: now, currentSlug: slug };
}

export function markScene(s: ElapsedState, slug: string, clock: Clock): ElapsedState {
  if (s.startedAt == null) return startElapsed(s, slug, clock);
  const now = clock();
  const delta = Math.max(0, now - s.lastMark);
  const prev = s.currentSlug;
  const perScene = { ...s.perScene };
  if (prev) perScene[prev] = (perScene[prev] ?? 0) + delta;
  return {
    ...s,
    total: s.total + delta,
    perScene,
    currentSlug: slug,
    lastMark: now,
  };
}
