import type { CSSProperties } from 'react';
import {
  useDeck,
  useEngineDispatch,
  usePlayerMode,
  usePresentation,
} from '@/react/PresentationProvider';
import { usePacing } from '@/react/usePacing';
import { useSections } from '@/ui/useSections';
import { hueStyle } from '@/ui/sections';
import './rail.css';

/**
 * THE TAB RAIL — the whole session's extent, down the fore edge of the manual.
 *
 * One tab per stage, as tall (or wide) as the minutes budgeted for it, in its part's hue. The
 * tab you are on sticks out further than the rest. A presenter reads "where am I, and how
 * much is left" off the proportions before any number; a participant who looked away finds
 * the room by its colour.
 *
 * Every tab is a jump. It replaces nothing — the grid overview and the keys still work — but
 * it is the fastest way back to a stage mid-lecture.
 */
export function TabRail({
  orientation = 'vertical',
  className,
}: {
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}) {
  const deck = useDeck();
  const dispatch = useEngineDispatch();
  const index = usePresentation((s) => s.index);
  const skipped = usePresentation((s) => s.skipped);
  const { parts, partIndex } = useSections();
  const mode = usePlayerMode();
  const pacing = usePacing();
  // Drift is the presenter's business, and only once the session clock has started.
  const behind = mode === 'present' && pacing.state === 'behind';

  return (
    <nav
      className={`rail rail--${orientation}${className ? ` ${className}` : ''}`}
      aria-label="שלבי ההרצאה"
    >
      {deck.scenes.map((scene, i) => {
        const part = parts[partIndex[i] ?? 0]!;
        const isFirstOfPart = part.first === i;
        const current = i === index;
        const minutes = scene.budgetMin ?? 1;
        return (
          <button
            key={scene.id}
            type="button"
            className={[
              'rail__tab',
              current && 'is-current',
              i < index && 'is-past',
              isFirstOfPart && i > 0 && 'is-part-start',
              skipped.includes(scene.slug) && 'is-skipped',
              current && behind && 'is-behind',
            ]
              .filter(Boolean)
              .join(' ')}
            style={
              {
                ...hueStyle(part.hue),
                '--grow': minutes,
                '--label-len': part.name.length,
              } as CSSProperties
            }
            aria-current={current ? 'step' : undefined}
            aria-label={`${i + 1}. ${scene.stage} · ${part.name}${scene.budgetMin ? ` · ${scene.budgetMin} דקות` : ''}`}
            title={`${scene.stage} · ${scene.budgetMin ?? '—'}′`}
            onClick={() => dispatch({ type: 'goToIndex', index: i })}
          >
            {current && orientation === 'vertical' && (
              <span className="rail__label" aria-hidden="true">
                <span className="rail__min mono">{scene.budgetMin ?? '—'}′</span>
                <span className="rail__part">{part.name}</span>
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
