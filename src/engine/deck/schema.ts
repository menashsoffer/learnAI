import { z } from 'zod';

/**
 * Deck STRUCTURE schema (meta + scene envelope). Build/dev only.
 * Per-scene `data` is validated by the scenes layer against each scene-type's own schema,
 * NOT here — the engine must not know concrete scene types.
 */

const slug = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case ascii');

const sceneStudentSchema = z.object({
  title: z.string().optional(),
  blocks: z.array(z.unknown()).optional(),
  /** false = reference only (no copy buttons on prompt blocks). Default true. */
  copyable: z.boolean().optional(),
});

export const sceneRecordSchema = z.object({
  id: z.string().min(1),
  slug,
  type: z.string().min(1),
  stage: z.string().min(1),
  /** The session part this stage belongs to — one divider tab, one hue. */
  part: z.string().min(1).optional(),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  /** id of a built-in illustration (see src/assets/illustrations). */
  image: z.string().optional(),
  student: sceneStudentSchema.optional(),
  budgetMin: z.number().positive().max(120).optional(),
  optional: z.boolean().optional(),
  controlPoint: z.string().min(1).optional(),
  data: z.unknown(),
});

export const deckMetaSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  locale: z.string().min(2),
  dir: z.enum(['rtl', 'ltr']),
  description: z.string().optional(),
  redirects: z.record(slug, slug).optional(),
  credits: z.string().optional(),
  presenterCode: z.string().min(1).optional(),
  totalMinutes: z.number().positive().max(600).optional(),
  participantUrl: z.string().url().optional(),
  prepChecklist: z
    .array(
      z.object({
        label: z.string().min(1),
        required: z.boolean().optional(),
        note: z.string().optional(),
      }),
    )
    .optional(),
});

export const deckSchema = z
  .object({
    meta: deckMetaSchema,
    scenes: z.array(sceneRecordSchema).min(1),
  })
  .superRefine((deck, ctx) => {
    const seen = new Set<string>();
    deck.scenes.forEach((s, i) => {
      if (seen.has(s.slug)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate slug "${s.slug}"`,
          path: ['scenes', i, 'slug'],
        });
      }
      seen.add(s.slug);
    });
    for (const from of Object.keys(deck.meta.redirects ?? {})) {
      if (seen.has(from)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `redirect key "${from}" collides with a real scene slug`,
          path: ['meta', 'redirects', from],
        });
      }
    }
  });

export type DeckSchemaInput = z.input<typeof deckSchema>;
