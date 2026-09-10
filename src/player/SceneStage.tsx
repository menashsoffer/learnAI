import { useMemo, useRef } from 'react';
import { usePresentation, useDeck } from '@/react/PresentationProvider';
import { useSwipeNav } from '@/react/useSwipeNav';
import { SceneView, ScenePlaceholder } from './SceneView';
import './stage.css';

/**
 * Renders the deck as absolutely-positioned slides with RTL directional transitions.
 * Only active ± 1 scenes mount their real Component; the rest are light placeholders.
 */
export function SceneStage() {
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
            {live ? <SceneView scene={scene} /> : <ScenePlaceholder scene={scene} />}
          </section>
        );
      })}
    </div>
  );
}
