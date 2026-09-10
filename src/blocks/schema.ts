import { z } from 'zod';

/**
 * Zod mirror of ./types.ts. Build/dev only — stripped from the offline runtime.
 * `columns` nest only leaf blocks (no columns-in-columns) — keeps the union non-recursive.
 */

const calloutTone = z.enum(['info', 'success', 'warning', 'danger', 'neutral']);

const headingBlock = z.object({
  kind: z.literal('heading'),
  level: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  text: z.string().min(1),
});

const paragraphBlock = z.object({
  kind: z.literal('paragraph'),
  text: z.string().min(1),
  emphasis: z.boolean().optional(),
});

const listBlock = z.object({
  kind: z.literal('list'),
  ordered: z.boolean().optional(),
  items: z.array(z.string().min(1)).min(1),
});

const calloutBlock = z.object({
  kind: z.literal('callout'),
  tone: calloutTone,
  title: z.string().optional(),
  text: z.string().optional(),
  items: z.array(z.string().min(1)).optional(),
});

const examplePromptBlock = z.object({
  kind: z.literal('example-prompt'),
  tone: z.enum(['accent', 'warning', 'success']).optional(),
  label: z.string().optional(),
  prompt: z.string().min(1),
});

const ctaBlock = z.object({
  kind: z.literal('cta'),
  label: z.string().min(1),
  href: z.string().min(1),
  external: z.boolean().optional(),
  note: z.string().optional(),
});

const leafBlocks = [
  headingBlock,
  paragraphBlock,
  listBlock,
  calloutBlock,
  examplePromptBlock,
  ctaBlock,
] as const;

const leafBlockSchema = z.discriminatedUnion('kind', [...leafBlocks]);

const columnsBlock = z.object({
  kind: z.literal('columns'),
  columns: z
    .array(
      z.object({
        title: z.string().optional(),
        tone: calloutTone.optional(),
        blocks: z.array(leafBlockSchema).min(1),
      }),
    )
    .min(1),
});

const blockSchema = z.discriminatedUnion('kind', [...leafBlocks, columnsBlock]);
export const blocksSchema = z.array(blockSchema);
