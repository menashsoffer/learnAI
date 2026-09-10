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

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | CalloutBlock
  | ExamplePromptBlock
  | ColumnsBlock
  | CallToActionBlock;
