export const KEYS = {
  /** `{ slug, phase, timerTarget }` — restored on deck open. */
  lastScene: 'lastScene',
  /** Free-text warmup answer (scene 2), device-local only. */
  warmupAnswer: 'warmupAnswer',
  /** Mini-game / quiz results, keyed by scene slug. */
  quizResults: 'quizResults',
  /** Presenter drawer + fx prefs. */
  presenterPrefs: 'presenterPrefs',
  /** `.fx-low` manual override. */
  fxLow: 'fxLow',
} as const;

export type PersistKey = (typeof KEYS)[keyof typeof KEYS];
