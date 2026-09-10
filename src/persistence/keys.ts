export const KEYS = {
  /** `{ slug, timerTarget }` — restored on deck open. */
  lastScene: 'lastScene',
  /** `.fx-low` manual override. */
  fxLow: 'fxLow',
} as const;

export type PersistKey = (typeof KEYS)[keyof typeof KEYS];
