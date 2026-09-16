export const KEYS = {
  /** `{ slug, timerTarget }` — restored on deck open. */
  lastScene: 'lastScene',
  /** `.fx-low` manual override. */
  fxLow: 'fxLow',
  /** `'light' | 'hall'` — the presenter's colour theme choice, per device. */
  theme: 'theme',
  /** Per-participant `prompt-builder` field contents, keyed by scene slug. */
  promptDraft: 'promptDraft',
} as const;

export type PersistKey = (typeof KEYS)[keyof typeof KEYS];
