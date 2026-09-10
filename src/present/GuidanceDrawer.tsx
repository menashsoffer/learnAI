import { useState } from 'react';
import { usePresentation, useDeck, useEngineDispatch } from '@/react/PresentationProvider';
import { formatClock } from '@/engine';
import './guidance.css';

/**
 * Present-mode guidance: a bottom drawer the presenter pulls up to peek and pushes down.
 * Collapsed = a thin strip (timer + next scene). Expanded = the "what to say" script.
 * On one screen this is on the projected view — keep it easy to hide.
 */
export function GuidanceDrawer() {
  const deck = useDeck();
  const dispatch = useEngineDispatch();
  const [open, setOpen] = useState(false);

  const index = usePresentation((s) => s.index);
  const count = usePresentation((s) => s.count);
  const timer = usePresentation((s) => s.timer);

  const scene = deck.scenes[index];
  const next = deck.scenes[index + 1];
  const script = scene?.presenterScript || scene?.notes || 'אין הנחיה לסצנה זו.';

  return (
    <aside className={`guide${open ? ' guide--open' : ''}`}>
      <button
        type="button"
        className="guide__handle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="guide__chev" aria-hidden="true">{open ? '▾' : '▴'}</span>
        <span className="guide__strip">
          <span className="guide__pos">{index + 1}/{count}</span>
          {timer.status !== 'idle' && (
            <span className={`guide__timer status-${timer.status}`}>⏱ {formatClock(timer.seconds)}</span>
          )}
          {next && <span className="guide__next">הבא: {next.title}</span>}
        </span>
      </button>

      {open && (
        <div className="guide__body">
          <div className="guide__section">
            <h3>מה להגיד</h3>
            <p>{script}</p>
          </div>
          <div className="guide__row">
            {next ? (
              <div className="guide__peek">
                <span className="guide__peek-label">סצנה הבאה</span>
                <strong>{next.title}</strong>
                {next.subtitle && <span className="guide__peek-sub">{next.subtitle}</span>}
              </div>
            ) : (
              <div className="guide__peek">
                <span className="guide__peek-label">זו הסצנה האחרונה</span>
              </div>
            )}
            <button
              type="button"
              className="btn-action btn-action--ghost"
              onClick={() => dispatch({ type: 'toggleOverlay', overlay: 'grid' })}
            >
              קפיצה לסצנה…
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
