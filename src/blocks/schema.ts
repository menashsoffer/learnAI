import { z } from 'zod';

/**
 * Zod mirror of ./types.ts. Content is data, never HTML — every authored block passes
 * through here before anything renders it.
 *
 * `columns` and `details` nest only LEAF blocks (no columns-in-columns, no details-in-
 * details), which keeps the union non-recursive and the failure messages readable.
 */

const calloutTone = z.enum(['info', 'success', 'warning', 'danger', 'neutral']);
const id = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id must be kebab-case ascii');

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

const doNowBlock = z.object({
  kind: z.literal('do-now'),
  text: z.string().min(1).max(140, 'a do-now line must fit on a phone at a glance'),
  timeboxSeconds: z.number().int().positive().max(3600).optional(),
});

const promptBuilderBlock = z
  .object({
    kind: z.literal('prompt-builder'),
    id,
    fields: z
      .array(
        z.object({
          id,
          label: z.string().min(1),
          placeholder: z.string().optional(),
          value: z.string().optional(),
          rows: z.number().int().positive().max(12).optional(),
        }),
      )
      .min(2),
    template: z.string().min(1),
    hint: z.string().optional(),
  })
  .superRefine((b, ctx) => {
    const declared = new Set(b.fields.map((f) => f.id));
    const used = new Set([...b.template.matchAll(/\{([a-z0-9-]+)\}/g)].map((m) => m[1]));
    for (const u of used) {
      if (!declared.has(u)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `template references {${u}} but no field declares that id`,
          path: ['template'],
        });
      }
    }
    // A field nothing assembles is a field the participant fills for nothing.
    for (const f of b.fields) {
      if (!used.has(f.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `field "${f.id}" never appears in the template`,
          path: ['fields'],
        });
      }
    }
  });

const conceptCardBlock = z.object({
  kind: z.literal('concept-card'),
  term: z.string().min(1),
  latin: z.string().optional(),
  what: z.string().min(1),
  when: z.string().min(1),
  example: z.string().min(1),
  notToBeConfusedWith: z.string().min(1),
});

const stepsBlock = z.object({
  kind: z.literal('steps'),
  steps: z.array(z.object({ text: z.string().min(1), copy: z.string().optional() })).min(1),
});

const checklistBlock = z.object({
  kind: z.literal('checklist'),
  id,
  title: z.string().optional(),
  items: z.array(z.string().min(1)).min(1),
});

const tableBlock = z.object({
  kind: z.literal('table'),
  caption: z.string().optional(),
  headers: z.array(z.string().min(1)).min(2),
  rows: z.array(z.array(z.string())).min(1),
});

const comparePairBlock = z.object({
  kind: z.literal('compare-pair'),
  beforeLabel: z.string().optional(),
  afterLabel: z.string().optional(),
  before: z.string().min(1),
  after: z.string().min(1),
  notes: z.array(z.string().min(1)).optional(),
});

/** Blocks that may appear inside a container (columns, details). */
const leafBlocks = [
  headingBlock,
  paragraphBlock,
  listBlock,
  calloutBlock,
  examplePromptBlock,
  ctaBlock,
  doNowBlock,
  conceptCardBlock,
  stepsBlock,
  checklistBlock,
  tableBlock,
  comparePairBlock,
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

const detailsBlock = z.object({
  kind: z.literal('details'),
  summary: z.string().min(1),
  blocks: z.array(leafBlockSchema).min(1),
});

/**
 * `prompt-builder` is intentionally OUTSIDE the leaf set: it is an interactive form, and
 * burying one inside a column or a collapsed <details> would hide the single interaction
 * the participant is meant to complete.
 */
const blockSchema = z.union([leafBlockSchema, columnsBlock, detailsBlock, promptBuilderBlock]);

/**
 * A ragged table renders as a silently broken grid, so the row/header check is enforced —
 * but `.superRefine` produces a ZodEffects, which a discriminatedUnion cannot hold. The
 * check therefore happens while walking the parsed array, which also reaches tables nested
 * inside `columns` and `details`.
 */
export const blocksSchema = z.array(blockSchema).superRefine((blocks, ctx) => {
  walk(blocks, [], ctx);
});

type Parsed = z.infer<typeof blockSchema>;

function walk(blocks: Parsed[], path: (string | number)[], ctx: z.RefinementCtx): void {
  blocks.forEach((b, i) => {
    const here = [...path, i];
    if (b.kind === 'table') {
      b.rows.forEach((row, r) => {
        if (row.length !== b.headers.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `table row ${r} has ${row.length} cells, expected ${b.headers.length}`,
            path: [...here, 'rows', r],
          });
        }
      });
    } else if (b.kind === 'columns') {
      b.columns.forEach((c, ci) => walk(c.blocks, [...here, 'columns', ci, 'blocks'], ctx));
    } else if (b.kind === 'details') {
      walk(b.blocks, [...here, 'blocks'], ctx);
    }
  });
}
