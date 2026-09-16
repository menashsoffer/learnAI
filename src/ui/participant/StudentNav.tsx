import { usePresentation, useEngineDispatch } from '@/react/PresentationProvider';
import { select } from '@/engine';

/**
 * Thumb-reachable navigation, pinned to the bottom on a phone. Participants move themselves
 * (there is no sync), so moving must be the easiest thing on the screen — not a pair of
 * small chevrons in a corner.
 *
 * "לפרומפט" jumps to the floor: mid-exercise, the thing someone needs is almost always the
 * copyable prompt, and hunting for it by scrolling is how people fall behind.
 */
export function StudentNav() {
  const dispatch = useEngineDispatch();
  const canPrev = usePresentation(select.canPrev);
  const canNext = usePresentation(select.canNext);

  const toPrompt = () => {
    const el = document.querySelector('.slide--active :is(.blk-prompt, .blk-builder)');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <nav className="studentnav" aria-label="ניווט">
      <button
        type="button"
        className="studentnav__btn"
        onClick={() => dispatch({ type: 'prev' })}
        disabled={!canPrev}
      >
        הקודם
      </button>
      <button type="button" className="studentnav__btn studentnav__btn--jump" onClick={toPrompt}>
        לפרומפט
      </button>
      <button
        type="button"
        className="studentnav__btn studentnav__btn--next"
        onClick={() => dispatch({ type: 'next' })}
        disabled={!canNext}
      >
        הבא
      </button>
    </nav>
  );
}
