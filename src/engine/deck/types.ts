/**
 * Deck data model — pure types, shared by the engine, the scenes layer and build scripts.
 * The engine treats `scene.data` as `unknown`; per-scene-type validation happens in the
 * scenes layer (src/scenes/validateDeck.ts) and in scripts/validate-decks.ts, never here.
 */

export interface SceneMeta {
  id: string;
  /** Stable, authored, URL key. Treated as API — see slug-stability guard. */
  slug: string;
  /** Scene-type registry key. Unknown types render the fallback scene. */
  type: string;
  /** Act / section label, shown in chrome and the scene map. */
  act: string;
  title: string;
  subtitle?: string;
  /** Presenter cue (shown with the `N` drawer). */
  notes?: string;
  /** Must make the scene understandable with no presenter (self-study link). */
  selfReading?: string;
}

export interface SceneRecord extends SceneMeta {
  /** Scene-type schema version, for migrate.ts. Defaults to 1. */
  version?: number;
  /** Validated against the scene-type's Zod schema outside the engine. */
  data: unknown;
}

export interface DeckMeta {
  id: string;
  title: string;
  /** BCP-47; drives i18n + direction. Default deck is 'he'. */
  locale: string;
  dir: 'rtl' | 'ltr';
  /** Points at a theme token module, e.g. 'dark-blue'. */
  brandKitRef?: string;
  description?: string;
  /** oldSlug -> newSlug, resolved by slugIndex so shared links survive renames. */
  redirects?: Record<string, string>;
  credits?: string;
}

export interface Deck {
  meta: DeckMeta;
  scenes: SceneRecord[];
}

export interface LoadedDeck {
  meta: DeckMeta;
  scenes: SceneRecord[];
  /** slug (canonical) -> position */
  slugToIndex: Map<string, number>;
  /** canonical slugs in deck order */
  order: string[];
}
