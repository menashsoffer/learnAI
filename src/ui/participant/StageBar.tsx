import { usePresentation, useDeck } from '@/react/PresentationProvider';

/**
 * WHERE ARE WE. Pinned to the top of every participant screen.
 *
 * There is no live sync from the presenter — that was a deliberate decision: a venue's
 * wifi and a single live channel are two more things that can fail in front of a room.
 * The cost of that decision is that a participant who looks up from their phone has no
 * automatic way to tell which stage everyone else is on.
 *
 * This is the answer, and it costs nothing to run: label the stage, always, in the same
 * place. "שלב 6 מתוך 11 · נקודת הציר" is enough for anyone to re-anchor in one glance,
 * whether they looked away for ten seconds or walked in late.
 */
export function StageBar() {
  const deck = useDeck();
  const index = usePresentation((s) => s.index);
  const count = usePresentation((s) => s.count);
  const scene = deck.scenes[index];

  return (
    <div className="stagebar">
      <span className="stagebar__pos" dir="rtl">
        שלב <b>{index + 1}</b> מתוך {count}
      </span>
      {scene?.stage && <span className="stagebar__name">{scene.stage}</span>}
      <span className="stagebar__track" aria-hidden="true">
        <span
          className="stagebar__fill"
          style={{ inlineSize: `${((index + 1) / Math.max(1, count)) * 100}%` }}
        />
      </span>
    </div>
  );
}
