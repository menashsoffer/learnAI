import type { SceneRecord } from '@/engine';
import type { Block } from '@/blocks/types';
import { BlocksRenderer } from '@/blocks/BlocksRenderer';
import { activitySchema, type ActivityData } from '@/scenes/activity/schema';

/**
 * THE PARTICIPANT HALF OF AN ACTIVITY — the screen in their hand during practice.
 *
 * The order below is the contract from documentation/PEDAGOGY.md, and it is fixed on
 * purpose. A room split between beginners and experienced users is NOT split into tracks;
 * it is separated vertically on one screen, in the same order every single time:
 *
 *     do-now + steps   everyone
 *     the prompt       the floor — copy it as-is and you succeed
 *     תקועים?          safety net
 *     ───────────
 *     סיימתם מוקדם?    the ceiling
 *
 * Someone struggling never reaches the bottom — they are still on the prompt. Someone who
 * finished scrolls past the divider and keeps going. Nobody is labelled, nobody is excluded,
 * and the wording is conditional on STATE ("סיימתם מוקדם?") rather than on identity.
 */
export function ActivityPanel({ scene }: { scene: SceneRecord }) {
  const parsed = activitySchema.safeParse(scene.data);
  if (!parsed.success) return null;
  const data: ActivityData = parsed.data;

  const doNow: Block = {
    kind: 'do-now',
    text: data.doNow,
    ...(data.timeboxSeconds ? { timeboxSeconds: data.timeboxSeconds } : {}),
  };

  const floor: Block =
    data.prompt.mode === 'copy'
      ? { kind: 'example-prompt', label: data.prompt.label, prompt: data.prompt.text }
      : {
          kind: 'prompt-builder',
          id: data.prompt.builderId,
          fields: data.prompt.fields,
          template: data.prompt.template,
          ...(data.prompt.hint ? { hint: data.prompt.hint } : {}),
        };

  const top: Block[] = [
    doNow,
    { kind: 'steps', steps: data.steps.map((text) => ({ text })) },
    floor,
  ];
  if (data.successCriteria?.length) {
    top.push({
      kind: 'checklist',
      id: `done-${scene.slug}`,
      title: 'איך יודעים שסיימתם',
      items: data.successCriteria,
    });
  }

  return (
    <div className="student__tiers">
      <BlocksRenderer blocks={top} copyable />

      {data.stuck && data.stuck.length > 0 && (
        <div className="student__net">
          <BlocksRenderer blocks={data.stuck as Block[]} copyable />
        </div>
      )}

      {data.extension && data.extension.length > 0 && (
        <>
          <hr className="student__divider" />
          <div className="student__ceiling">
            <BlocksRenderer blocks={data.extension as Block[]} copyable />
          </div>
        </>
      )}
    </div>
  );
}
