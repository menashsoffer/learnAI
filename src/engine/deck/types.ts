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

export interface PrepItem {
  label: string;
  required?: boolean;
  note?: string;
}

export interface SceneMeta {
  id: string;
  /** Stable, authored, URL key. Treated as API — see slug-stability guard. */
  slug: string;
  /** Scene-type registry key. Unknown types render the fallback scene. */
  type: string;
  /**
   * Arc-stage label — "פרומפט · בסיס". Shown in the chrome, the scene map, and (crucially)
   * on the participant's stage bar, which is how someone who looked away re-anchors.
   */
  stage: string;
  /**
   * The session part this stage belongs to ("פרומפטינג", "בנייה"). Consecutive stages that
   * share a part share one divider hue. Falls back to the stage label's first word.
   */
  part?: string;
  title: string;
  subtitle?: string;
  /** id of a built-in illustration (see src/assets/illustrations). */
  image?: string;
  /** Participant-facing companion content (study mode). */
  student?: SceneStudent;

  /* ---- Pacing. Formerly the minute column of documentation/RUN-SHEET.md. ---- */

  /** Minutes budgeted for this stage. Drives drift, projection and the per-stage bar. */
  budgetMin?: number;
  /** May be dropped when running late without breaking the arc. */
  optional?: boolean;
  /** Presenter instruction surfaced ON this stage, while it can still be acted on. */
  controlPoint?: string;
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
  description?: string;
  /** oldSlug -> newSlug, resolved by slugIndex so shared links survive renames. */
  redirects?: Record<string, string>;
  credits?: string;
  /** Authored session length in minutes. The plan's slack is measured against it. */
  totalMinutes?: number;
  /** Shown as a projectable QR on the pre-flight screen — how the room gets in. */
  participantUrl?: string;
  /** Pre-flight checklist. `required` items are the ones that sink a lecture if missed. */
  prepChecklist?: PrepItem[];
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
