import { useEffect } from 'react';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';
import { BlocksRenderer } from '@/blocks/BlocksRenderer';
import type { Block } from '@/blocks/types';
import { formatClock } from '@/engine';
import { Icon } from '@/assets/icons/Icon';
import { activitySchema, type ActivityData } from './schema';

/**
 * The PROJECTED half of an activity. The participant half lives in
 * `src/ui/participant/ActivityPanel.tsx` — same authored data, two audiences, and neither
 * one is a cut-down copy of the other.
 *
 * On the projector: the headline, what the room is doing, and a timer big enough to read
 * from the back. The steps and the prompt are on the participants' own screens, where they
 * can be copied — putting them here would just make the slide a document.
 */
function Activity({ data, scene, api, active = true }: SceneProps<ActivityData>) {
  const { model, setTarget, toggle, reset } = api.timer;

  // Arm the timer only when this scene becomes the active one — neighbours are pre-mounted and
  // must not steal it. Deliberately NOT keyed on `model.target`: a presenter's ±adjust changes
  // the target, and re-arming then would wipe a running countdown. `setTarget` is idempotent.
  useEffect(() => {
    if (active && data.timeboxSeconds) setTarget(data.timeboxSeconds);
  }, [active, data.timeboxSeconds, setTarget]);

  return (
    <SceneShell scene={scene} className="activity">
      <p className="activity__donow">{data.doNow}</p>

      {data.board && data.board.length > 0 && <BlocksRenderer blocks={data.board as Block[]} />}

      {!api.online && (
        <div className="blk-callout tone-warning">
          <div className="blk-callout__title">שלב זה דורש חיבור לאינטרנט</div>
          <p className="blk-callout__text">הקישור לכלי ה-AI ייפתח בלשונית חדשה.</p>
        </div>
      )}

      {data.timeboxSeconds && (
        <div className={`inline-timer status-${model.status}`}>
          <span className="inline-timer__clock mono" dir="ltr" aria-live="polite">
            {formatClock(model.seconds)}
          </span>
          <div className="inline-timer__actions">
            <button
              type="button"
              className="btn-action"
              onClick={toggle}
              disabled={model.status === 'done'}
            >
              <Icon
                name={
                  model.status === 'running' ? 'pause' : model.status === 'done' ? 'check' : 'play'
                }
                size={18}
              />
              {model.status === 'running' ? 'השהה' : model.status === 'done' ? 'הסתיים' : 'התחל'}
            </button>
            <button type="button" className="btn-action btn-action--ghost" onClick={reset}>
              <Icon name="reset" size={18} />
              איפוס
            </button>
          </div>
        </div>
      )}
    </SceneShell>
  );
}

export default defineScene<ActivityData>({
  type: 'activity',
  schema: activitySchema,
  Component: Activity,
  defaultData: () => ({
    doNow: '',
    steps: [],
    prompt: { mode: 'copy', label: '', text: '' },
  }),
});
