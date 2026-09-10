/**
 * Declarative rich-content blocks. These REPLACE the raw `contentHtml` / `instructionsHtml`
 * strings from the legacy deck. No HTML, ever — a bespoke visual becomes a new scene type.
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

export interface QuoteBlock {
  kind: 'quote';
  text: string;
  attribution?: string;
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

export interface KbdBlock {
  kind: 'kbd';
  keys: string[];
  description: string;
}

export interface ImageBlock {
  kind: 'image';
  assetId: string;
  alt: string;
  caption?: string;
}

export interface SpacerBlock {
  kind: 'spacer';
  size?: 'sm' | 'md' | 'lg';
}

export type Block =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | CalloutBlock
  | ExamplePromptBlock
  | QuoteBlock
  | ColumnsBlock
  | CallToActionBlock
  | KbdBlock
  | ImageBlock
  | SpacerBlock;

export type BlockKind = Block['kind'];
