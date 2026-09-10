import { useMemo, useRef } from 'react';
import { usePresentation, useDeck } from '@/react/PresentationProvider';
import type { PlayerMode } from '@/react/PresentationProvider';
import { useSwipeNav } from '@/react/useSwipeNav';
import { SceneView } from './SceneView';
import { StudentScene } from '@/study/StudentScene';
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
              (mode === 'study' ? <StudentScene scene={scene} /> : <SceneView scene={scene} />)}
          </section>
        );
      })}
    </div>
  );
}
