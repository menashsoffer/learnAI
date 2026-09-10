import { useEffect } from 'react';
import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';
import { BlocksRenderer } from '@/blocks/BlocksRenderer';
import { blocksSchema } from '@/blocks/schema';
import type { Block } from '@/blocks/types';
import { formatClock } from '@/engine';

const schema = z.object({
  blocks: blocksSchema,
  /** Optional inline work timer (used by the build steps). */
  timerSeconds: z.number().int().positive().optional(),
});
type Data = z.infer<typeof schema>;

function WorkshopInstructions({ data, scene, api }: SceneProps<Data>) {
  const { model, setTarget, toggle, reset } = api.timer;

  useEffect(() => {
    if (data.timerSeconds) setTarget(data.timerSeconds);
  }, [data.timerSeconds, setTarget]);

  return (
    <SceneShell scene={scene} className="workshop-instructions">
      {!api.online && (
        <div className="blk-callout tone-warning">
          <div className="blk-callout__title">שלב זה דורש חיבור לאינטרנט</div>
          <p className="blk-callout__text">
            הקישור לכלי ה-AI ייפתח בלשונית חדשה. שאר האתר פועל גם ללא רשת.
          </p>
        </div>
      )}
      <BlocksRenderer blocks={data.blocks as Block[]} />
      {data.timerSeconds && (
        <div className={`inline-timer status-${model.status}`}>
          <span className="inline-timer__clock" aria-live="polite">
            {formatClock(model.seconds)}
          </span>
          <button
            type="button"
            className="btn-action"
            onClick={toggle}
            disabled={model.status === 'done'}
          >
            {model.status === 'running'
              ? '⏸ השהה'
              : model.status === 'done'
                ? '✔ הסתיים'
                : '▶ התחל'}
          </button>
          <button type="button" className="btn-action btn-action--ghost" onClick={reset}>
            איפוס
          </button>
        </div>
      )}
    </SceneShell>
  );
}

export default defineScene<Data>({
  type: 'workshop-instructions',
  schema,
  Component: WorkshopInstructions,
  defaultData: () => ({ blocks: [] }),
});
