import { usePresentation, useDeck } from '@/react/PresentationProvider';
import { useCurrentPart } from '@/ui/useSections';
import { stageDetail } from '@/ui/sections';
import { TabRail } from '@/ui/rail/TabRail';

/**
 * WHERE ARE WE. Pinned to the top of every participant screen.
 *
 * There is no live sync from the presenter — a deliberate decision: a venue's wifi and a
 * single live channel are two more things that can fail in front of a room. The cost is that
 * a participant who looks up from their phone has no automatic way to tell which stage
 * everyone else is on.
 *
 * This is the answer, and it costs nothing to run: the same divider colours the room sees on
 * the projector, the same tab rail to scale, and the stage named in the same place, always.
 */
export function StageBar() {
  const deck = useDeck();
  const index = usePresentation((s) => s.index);
  const count = usePresentation((s) => s.count);
  const scene = deck.scenes[index];
  const { part, style } = useCurrentPart();
  const stage = scene && stageDetail(scene, part.name);

  return (
    <div className="stagebar" style={style}>
      <div className="stagebar__row">
        <span className="stagebar__part">{part.name}</span>
        {stage && <span className="stagebar__name">{stage}</span>}
        <span
          className="stagebar__pos mono"
          dir="ltr"
          aria-label={`שלב ${index + 1} מתוך ${count}`}
        >
          {String(index + 1).padStart(2, '0')}
          <span className="stagebar__of">/{String(count).padStart(2, '0')}</span>
        </span>
      </div>
      <TabRail orientation="horizontal" className="stagebar__rail" />
    </div>
  );
}
