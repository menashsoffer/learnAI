import { useEffect, useMemo, useRef } from 'react';
import { usePresentation, useDeck } from '@/react/PresentationProvider';
import type { PlayerMode } from '@/react/PresentationProvider';
import { useSwipeNav } from '@/react/useSwipeNav';
import { SceneView } from './SceneView';
import { ParticipantScene } from '@/ui/participant/ParticipantScene';
import { useSections } from '@/ui/useSections';
import { hueStyle } from '@/ui/sections';
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

  const { parts, partIndex } = useSections();

  const ref = useRef<HTMLDivElement>(null);
  useSwipeNav(ref.current);
  useProjectionFitWarning(index, mode);

  return (
    <div className="stage" ref={ref}>
      {deck.scenes.map((scene, i) => {
        const state = i === index ? 'active' : i < index ? 'prev' : 'next';
        const live = mounted.includes(i);
        const hue = parts[partIndex[i] ?? 0]!.hue;
        return (
          <section
            key={scene.id}
            className={`slide slide--${state}${mode === 'study' ? ' slide--study' : ''}`}
            style={hueStyle(hue)}
            data-hue={hue}
            aria-hidden={state !== 'active'}
            aria-label={`סצנה ${i + 1} מתוך ${count}: ${scene.title}`}
            inert={state !== 'active'}
          >
            {/* The part's climate is the ground; the scene sits on a white card above it. */}
            <div className="leaf">
              <div className="leaf__scroll">
                {live &&
                  (mode === 'study' ? (
                    <ParticipantScene scene={scene} active={state === 'active'} />
                  ) : (
                    <SceneView scene={scene} active={state === 'active'} />
                  ))}
              </div>
            </div>
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
      // The leaf is the scroller, so its own scroll overflow is the measure.
      const slide = document.querySelector('.slide--active .leaf__scroll');
      if (!slide) return;
      const overflow = slide.scrollHeight - slide.clientHeight;
      if (overflow > 2) {
        console.warn(
          `[projection] scene ${index + 1} overflows its slide by ${Math.round(overflow)}px — that content ` +
            `will be invisible on a projector. Trim it, or compact the blocks at ` +
            `\`:root[data-distance='project']\`.`,
        );
      }
    }, 350);
    return () => clearTimeout(id);
  }, [index, mode]);
}
