import { useEffect, useMemo, useRef } from 'react';
import { usePresentation, useDeck } from '@/react/PresentationProvider';
import type { PlayerMode } from '@/react/PresentationProvider';
import { useSwipeNav } from '@/react/useSwipeNav';
import { SceneView } from './SceneView';
import { ParticipantScene } from '@/ui/participant/ParticipantScene';
import './stage.css';

/**
 * Renders the deck as absolutely-positioned slides with RTL directional transitions.
 * Only active ± 1 scenes mount; the rest render nothing until they enter the window.
 * `study` mode swaps the full scene Component for the leaner participant view.
 */
export function SceneStage({ mode = 'plain' }: { mode?: PlayerMode }) {
  const deck = useDeck();
  const index = usePresentation((s) => s.index);
  const count = usePresentation((s) => s.count);
  const mounted = useMemo(
    () => [index - 1, index, index + 1].filter((i) => i >= 0 && i < count),
    [index, count],
  );

  const ref = useRef<HTMLDivElement>(null);
  useSwipeNav(ref.current);
  useProjectionFitWarning(index, mode);

  return (
    <div className="stage" ref={ref}>
      {deck.scenes.map((scene, i) => {
        const state = i === index ? 'active' : i < index ? 'prev' : 'next';
        const live = mounted.includes(i);
        return (
          <section
            key={scene.id}
            className={`slide slide--${state}`}
            aria-hidden={state !== 'active'}
            aria-label={`סצנה ${i + 1} מתוך ${count}: ${scene.title}`}
            inert={state !== 'active'}
          >
            {live &&
              (mode === 'study' ? <ParticipantScene scene={scene} /> : <SceneView scene={scene} />)}
          </section>
        );
      })}
    </div>
  );
}

/**
 * A projected slide has no scrollbar: anything past the bottom edge is simply never seen,
 * and nothing tells the presenter — they find out in front of a room, or never.
 *
 * So in dev, say it loudly while the author is still looking at the scene. This cannot be a
 * unit test: jsdom does no layout, so overflow is only knowable in a real engine.
 */
function useProjectionFitWarning(index: number, mode: PlayerMode): void {
  useEffect(() => {
    if (!import.meta.env.DEV || mode === 'study') return;
    const id = setTimeout(() => {
      const shell = document.querySelector('.slide--active .scene-shell');
      if (!shell) return;
      const overflow = shell.scrollHeight - shell.clientHeight;
      if (overflow > 2) {
        console.warn(
          `[projection] scene ${index + 1} overflows its slide by ${overflow}px — that content ` +
            `will be invisible on a projector. Trim it, or compact the blocks at ` +
            `\`:root[data-distance='project']\`.`,
        );
      }
    }, 350);
    return () => clearTimeout(id);
  }, [index, mode]);
}
