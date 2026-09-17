import { useState } from 'react';
import { usePresentation, useDeck, useEngineDispatch } from '@/react/PresentationProvider';
import { usePacing } from '@/react/usePacing';
import { formatClock, formatElapsed, select } from '@/engine';
import { t } from '@/i18n';
import { Icon } from '@/assets/icons/Icon';
import { useCurrentPart } from '@/ui/useSections';
import './presenter.css';

/**
 * PRESENT MODE — the instrument, not the slide.
 *
 * The brief was that presenting is stressful. The cause was concrete: the pacing lived in a
 * markdown run sheet, so the presenter had to hold ninety minutes of budget in their head
 * while talking. Everything here exists to take one specific thing off that load:
 *
 *   session clock + drift   am I ahead or behind, right now
 *   stage budget bar        is THIS stage running long
 *   control point           the run sheet's instruction, on the stage it applies to
 *   recovery                if I am over, which optional stage buys the time back
 *   next                    what is coming, so the transition can be spoken
 *
 * Collapsed it is a thin strip; on a single-screen setup this is on the projected view, so
 * it must stay easy to hide. Marked `glance`: read in about a second and a half, standing,
 * mid-sentence.
 */
export function GuidanceDrawer() {
  const deck = useDeck();
  const dispatch = useEngineDispatch();
  const [open, setOpen] = useState(false);

  const index = usePresentation((s) => s.index);
  const count = usePresentation((s) => s.count);
  const timer = usePresentation((s) => s.timer);
  const session = usePresentation((s) => s.session);
  const skipped = usePresentation((s) => s.skipped);
  const canPrev = usePresentation(select.canPrev);
  const canNext = usePresentation(select.canNext);
  const pacing = usePacing();
  const { part, style } = useCurrentPart();

  const scene = deck.scenes[index];
  const next = deck.scenes[index + 1];

  /**
   * Whole minutes only. The model keeps a decimal because the arithmetic needs it, but
   * "26.7′ מקדימה" is not a number anyone parses mid-sentence — and a presenter does not
   * act on six seconds. Round for the eye, keep the precision in the engine.
   */
  const drift = Math.round(pacing.driftMin);
  const driftLabel = drift === 0 ? 'בזמן' : drift > 0 ? `${drift}′ מאחור` : `${-drift}′ מקדימה`;

  const stagePct =
    pacing.stageBudgetSec > 0
      ? Math.min(100, (pacing.stageElapsedSec / pacing.stageBudgetSec) * 100)
      : 0;

  return (
    <aside
      className={`guide${open ? ' guide--open' : ''}`}
      data-distance-scope="glance"
      style={style}
    >
      <div className="guide__bar-wrapper">
        <button
          type="button"
          className="guide__nav-btn"
          onClick={() => dispatch({ type: 'prev' })}
          disabled={!canPrev}
          title={t('chrome.prev')}
          aria-label={t('chrome.prev')}
        >
          <Icon name="prev" size={22} />
        </button>

        <button
          type="button"
          className="guide__handle"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          <span className="guide__chev" aria-hidden="true">
            <Icon name={open ? 'chevron-down' : 'chevron-up'} size={18} />
          </span>
          <span className="guide__strip">
            <span className="guide__pos mono" dir="ltr">
              {String(index + 1).padStart(2, '0')}
              <span className="guide__pos-of">/{String(count).padStart(2, '0')}</span>
            </span>
            <span className="guide__part">{part.name}</span>

            {/* Session clock. Distinct shape from the countdown below — they must never be
                confused at a glance: one is how long I have been talking, the other is how
                long THEY have left. */}
            <span className={`guide__session state-${pacing.state}`}>
              <span className="guide__session-clock mono" dir="ltr">
                {formatElapsed(session.elapsed)}
              </span>
              <span className="guide__drift">{driftLabel}</span>
            </span>

            {timer.status !== 'idle' && (
              <span className={`guide__timer mono status-${timer.status}`} dir="ltr">
                {formatClock(timer.seconds)}
              </span>
            )}

            {next && (
              <span className="guide__next">
                <span className="guide__next-label">הבא</span> {next.title}
              </span>
            )}
          </span>

          {/* Stage budget. Calm amber when over — never red: there are people watching. */}
          <span className="guide__bar" aria-hidden="true">
            <span
              className={`guide__bar-fill${pacing.stageOver ? ' is-over' : ''}`}
              style={{ inlineSize: `${stagePct}%` }}
            />
          </span>
        </button>

        <button
          type="button"
          className="guide__nav-btn"
          onClick={() => dispatch({ type: 'next' })}
          disabled={!canNext}
          title={t('chrome.next')}
          aria-label={t('chrome.next')}
        >
          <Icon name="next" size={22} />
        </button>
      </div>

      {open && (
        <div className="guide__body">
          <div className="guide__meters">
            <Meter
              label="בהרצאה"
              value={formatElapsed(session.elapsed)}
              note={`מתוכנן: ${pacing.stage?.startMin ?? 0}′`}
              state={pacing.state}
            />
            <Meter
              label="בשלב הזה"
              value={formatElapsed(pacing.stageElapsedSec)}
              note={`תקציב: ${pacing.stage?.budgetMin ?? 0}′`}
              state={pacing.stageOver ? 'behind' : 'on-plan'}
            />
            <Meter
              label="צפי סיום"
              value={`${Math.round(pacing.projectedEndMin)}′`}
              note={
                pacing.projectedOverrunMin > 0
                  ? `חריגה ${Math.round(pacing.projectedOverrunMin)}′`
                  : 'בתוך הזמן'
              }
              state={pacing.projectedOverrunMin > 0 ? 'behind' : 'ahead'}
            />
          </div>

          {/* The run sheet's control point, on the stage where it can still be acted on. */}
          {pacing.controlPoint && (
            <div className="guide__control">
              <span className="guide__control-tag">נקודת בקרה</span>
              <p>{pacing.controlPoint}</p>
            </div>
          )}

          {/* Only appears when actually over — and it names the stage, so the decision is
              "drop this one" rather than "find three minutes somewhere". */}
          {pacing.recovery.drop.length > 0 && (
            <div className="guide__recover">
              <span className="guide__recover-tag">להחזיר זמן</span>
              <p>
                {pacing.recovery.enough
                  ? `דילוג על ${pacing.recovery.drop.map((d) => d.stage).join(' · ')} מחזיר ${pacing.recovery.savedMin}′ ומחזיר אותך לזמן.`
                  : `גם דילוג על כל שלבי הרשות מחזיר רק ${pacing.recovery.savedMin}′ — צריך לקצר שלב ליבה.`}
              </p>
            </div>
          )}

          <div className="guide__row">
            {next ? (
              <div className="guide__peek">
                <strong>
                  <span className="guide__peek-label">הבא:</span> {next.title}
                </strong>
                {next.subtitle && <span className="guide__peek-sub">{next.subtitle}</span>}
              </div>
            ) : (
              <div className="guide__peek">
                <span className="guide__peek-label">זו הסצנה האחרונה</span>
              </div>
            )}

            <div className="guide__row-actions">
              {/* Skipping is a first-class move, not an accident: an optional stage can be
                  dropped mid-lecture without the counter or the plan going wrong. */}
              {scene?.optional && !skipped.includes(scene.slug) && (
                <button
                  type="button"
                  className="btn-action btn-action--ghost"
                  onClick={() => {
                    dispatch({ type: 'skip', slug: scene.slug });
                    dispatch({ type: 'next' });
                  }}
                >
                  <Icon name="skip" size={18} />
                  דלג על השלב
                </button>
              )}
              <button
                type="button"
                className="btn-action btn-action--ghost"
                onClick={() => dispatch({ type: 'session/toggle' })}
              >
                <Icon name={session.status === 'running' ? 'pause' : 'play'} size={18} />
                {session.status === 'running' ? 'עצור שעון' : 'הפעל שעון'}
              </button>
              <button
                type="button"
                className="btn-action btn-action--ghost"
                onClick={() => dispatch({ type: 'toggleOverlay', overlay: 'grid' })}
              >
                <Icon name="grid" size={18} />
                תוכן העניינים
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function Meter({
  label,
  value,
  note,
  state,
}: {
  label: string;
  value: string;
  note: string;
  state: string;
}) {
  return (
    <div className={`guide__meter state-${state}`}>
      <span className="guide__meter-label">{label}</span>
      <span className="guide__meter-value mono" dir="ltr">
        {value}
      </span>
      <span className="guide__meter-note">{note}</span>
    </div>
  );
}
