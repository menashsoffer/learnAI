import { z } from 'zod';
import { blocksSchema } from '@/blocks/schema';

/**
 * THE FOUR-TIER ACTIVITY CONTRACT.
 *
 * `documentation/PEDAGOGY.md` specifies a fixed vertical structure for every practice
 * screen, designed for a room split roughly 47/47 between beginners and experienced users:
 *
 *     1. doNow + steps      everyone
 *     2. prompt             THE FLOOR — copy it as-is and you succeed
 *        ─────────────
 *     3. stuck              safety net
 *     4. extension          the ceiling ("סיימתם מוקדם?")
 *
 * It used to be followed by hand in deck.json and checked by nobody, which is exactly why
 * it was applied inconsistently — and why participants got lost. Encoding it here makes an
 * incomplete practice screen impossible to author: `doNow`, `steps` and a floor are
 * REQUIRED, and the floor must be something that works unedited.
 *
 * Wording is conditional on STATE, never on identity — "סיימתם מוקדם?", never "למתקדמים".
 * Nobody is excluded; they simply have not got there yet.
 */

const promptFloor = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('copy'),
    label: z.string().min(1),
    /** Must run unedited. Someone who is stuck never reaches tier 3 — they are still here. */
    text: z.string().min(1),
  }),
  z.object({
    mode: z.literal('build'),
    /** The four-field builder — only where the template is being taught. */
    builderId: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    fields: z
      .array(
        z.object({
          id: z
            .string()
            .min(1)
            .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
          label: z.string().min(1),
          placeholder: z.string().optional(),
          value: z.string().optional(),
          rows: z.number().int().positive().max(12).optional(),
        }),
      )
      .min(2),
    template: z.string().min(1),
    hint: z.string().optional(),
  }),
]);

export const activitySchema = z.object({
  /** Tier 0 — the imperative. First thing read, largest thing on the screen. */
  doNow: z.string().min(1).max(140, 'a do-now line must fit on a phone at a glance'),
  timeboxSeconds: z.number().int().positive().max(3600).optional(),

  /** Tier 1 — everyone. Three steps is the target; more than five is a different exercise. */
  steps: z.array(z.string().min(1)).min(1).max(5, 'more than five steps is a second activity'),

  /** Tier 2 — the floor. */
  prompt: promptFloor,

  /** "How do I know I'm done" — without this, finishing is a guess. */
  successCriteria: z.array(z.string().min(1)).optional(),

  /** Tier 3 — safety net. */
  stuck: blocksSchema.optional(),

  /** Tier 4 — the ceiling. */
  extension: blocksSchema.optional(),

  /** What the room sees on the projector — deliberately not the participant content. */
  board: blocksSchema.optional(),
});

export type ActivityData = z.infer<typeof activitySchema>;
