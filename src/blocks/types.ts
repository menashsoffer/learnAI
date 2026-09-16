/**
 * Declarative rich-content blocks — the only sanctioned way to author scene content.
 * No HTML, ever: a bespoke visual becomes a new scene type.
 */

export type CalloutTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

export interface HeadingBlock {
  kind: 'heading';
  level?: 2 | 3 | 4;
  text: string;
}

export interface ParagraphBlock {
  kind: 'paragraph';
  text: string;
  emphasis?: boolean;
}

export interface ListBlock {
  kind: 'list';
  ordered?: boolean;
  items: string[];
}

export interface CalloutBlock {
  kind: 'callout';
  tone: CalloutTone;
  title?: string;
  text?: string;
  items?: string[];
}

/** The dominant legacy pattern: "role / context / task / format" prompt in a coloured box. */
export interface ExamplePromptBlock {
  kind: 'example-prompt';
  tone?: 'accent' | 'warning' | 'success';
  label?: string;
  prompt: string;
}

export interface ColumnsBlock {
  kind: 'columns';
  columns: Array<{ title?: string; tone?: CalloutTone; blocks: Block[] }>;
}

export interface CallToActionBlock {
  kind: 'cta';
  label: string;
  href: string;
  external?: boolean;
  note?: string;
}

/**
 * The single imperative sentence that opens a participant's activity screen. Largest thing
 * on the page, and always first: mid-practice on a phone, "what am I supposed to be doing
 * right now" must not be something you read a paragraph to discover.
 */
export interface DoNowBlock {
  kind: 'do-now';
  text: string;
  /** Optional self-started countdown, in seconds. There is no presenter sync by design, so
   *  the participant starts it themselves — an honest timebox rather than a fake one. */
  timeboxSeconds?: number;
}

/** One field of a `prompt-builder`. */
export interface PromptField {
  /** Stable key — also the persistence key for the participant's draft. */
  id: string;
  label: string;
  placeholder?: string;
  /** Prefilled starting value; the participant edits over it. */
  value?: string;
  rows?: number;
}

/**
 * The four-component template as an editable form: the fields assemble live into a finished,
 * copyable prompt. Used ONLY where the template is being taught and first practised — after
 * that the template is assumed, and re-scaffolding it would insult the room.
 */
export interface PromptBuilderBlock {
  kind: 'prompt-builder';
  /** Persistence scope, so a draft survives navigation and reload. */
  id: string;
  fields: PromptField[];
  /** Assembly pattern; `{id}` placeholders are replaced by field values. */
  template: string;
  hint?: string;
}

/**
 * Skills / MCP / Plugins / Agents. A fixed four-field shape, because the whole point is that
 * the four concepts are compared on identical axes rather than each described in its own way.
 */
export interface ConceptCardBlock {
  kind: 'concept-card';
  term: string;
  /** Latin spelling shown alongside the Hebrew — these words arrive in English. */
  latin?: string;
  what: string;
  when: string;
  /** A municipal example. Abstractions do not land with this audience; cases do. */
  example: string;
  /** "…and here is what it is NOT" — the distinction that stops the four blurring. */
  notToBeConfusedWith: string;
}

/** Numbered walkthrough; each step may carry its own copyable text. */
export interface StepsBlock {
  kind: 'steps';
  steps: Array<{ text: string; copy?: string }>;
}

/** Tick list whose state persists per participant (verification checklists, pre-flight). */
export interface ChecklistBlock {
  kind: 'checklist';
  id: string;
  title?: string;
  items: string[];
}

/** Comparison table — the consolidated Skills/MCP/Plugins/Agents view, and similar. */
export interface TableBlock {
  kind: 'table';
  caption?: string;
  headers: string[];
  rows: string[][];
}

/** Collapsed depth: "רוצים להעמיק?" / "תקועים?" without cluttering the page. */
export interface DetailsBlock {
  kind: 'details';
  summary: string;
  blocks: Block[];
}

/**
 * Weak prompt beside strong prompt, annotated. The core teaching device that carries the
 * three prompting levels — improvement has to be SEEN, not asserted.
 */
export interface ComparePairBlock {
  kind: 'compare-pair';
  beforeLabel?: string;
  afterLabel?: string;
  before: string;
  after: string;
  /** What changed between them, in order. */
  notes?: string[];
}

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | CalloutBlock
  | ExamplePromptBlock
  | ColumnsBlock
  | CallToActionBlock
  | DoNowBlock
  | PromptBuilderBlock
  | ConceptCardBlock
  | StepsBlock
  | ChecklistBlock
  | TableBlock
  | DetailsBlock
  | ComparePairBlock;
