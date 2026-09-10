import { useEffect } from 'react';
import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';
import { formatClock } from '@/engine';

const schema = z.object({
  defaultSeconds: z.number().int().positive(),
});
type Data = z.infer<typeof schema>;

function WorkshopTimer({ data, scene, api }: SceneProps<Data>) {
  const { model, setTarget, toggle, reset, adjust } = api.timer;

  // Arm the engine's single countdown to this scene's target on entry.
  useEffect(() => {
    setTarget(data.defaultSeconds);
  }, [data.defaultSeconds, setTarget]);

  const label =
    model.status === 'running' ? '⏸ השהה' : model.status === 'done' ? '✔ הסתיים' : '▶ התחל';

  return (
    <SceneShell scene={scene} align="center">
      <div className={`timer-box status-${model.status}`}>
        <div className="timer-box__clock" aria-live="polite">
          {formatClock(model.seconds)}
        </div>
        <div className="timer-box__controls">
          <button type="button" className="btn-action" onClick={toggle} disabled={model.status === 'done'}>
            {label}
          </button>
          <button type="button" className="btn-action btn-action--ghost" onClick={() => adjust(60)}>
            +1 דק׳
          </button>
          <button type="button" className="btn-action btn-action--ghost" onClick={() => adjust(-60)}>
            −1 דק׳
          </button>
          <button type="button" className="btn-action btn-action--ghost" onClick={reset}>
            איפוס
          </button>
        </div>
      </div>
    </SceneShell>
  );
}

export default defineScene<Data>({
  type: 'workshop-timer',
  version: 1,
  schema,
  Component: WorkshopTimer,
  defaultData: () => ({ defaultSeconds: 600 }),
  capabilities: { timer: true },
  presenterHints: (d, m) => ({ cue: m.notes, estSeconds: d.defaultSeconds, advanceOn: 'timer' }),
});
