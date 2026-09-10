/**
 * Deck data model — pure types, shared by the engine, the scenes layer and build scripts.
 * The engine treats `scene.data` as `unknown`; per-scene-type validation happens in the
 * scenes layer (src/scenes/validateDeck.ts) and in scripts/validate-decks.ts, never here.
 */

/** Participant-facing companion payload for a scene (shown in `study` mode only). */
export interface SceneStudent {
  /** Optional heading for the student panel (defaults to a generic "פעילות"). */
  title?: string;
  /** Declarative blocks: operating instructions, copyable prompts, links. */
  blocks?: unknown[];
  /** false = reference only, no copy buttons. Default true. */
  copyable?: boolean;
}

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
  /** Presenter cue — shown in `present` mode only, never to participants. */
  notes?: string;
  /** Longer presenter script ("what to say"). Present mode only. */
  presenterScript?: string;
  /** id of a built-in illustration (see src/assets/illustrations). */
  image?: string;
  /** Participant-facing companion content (study mode). */
  student?: SceneStudent;
}

export interface SceneRecord extends SceneMeta {
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
  /** Soft gate for the presenter entry — NOT security, just stops participants
   *  wandering into the "what to say" notes. Absent = presenter entry is open. */
  presenterCode?: string;
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
