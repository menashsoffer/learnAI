import { useEffect, useRef } from 'react';
import { usePresentation, useDeck, useEngineDispatch } from '@/react/PresentationProvider';
import { t } from '@/i18n';
import { Icon } from '@/assets/icons/Icon';
import { useSections } from '@/ui/useSections';
import { hueStyle, stageDetail } from '@/ui/sections';

/**
 * Esc overlay: the manual's table of contents. One row per part, set on its divider colour,
 * its stages listed beside it with their minutes. Overlay STATE, not a route.
 */
export function GridOverview() {
  const deck = useDeck();
  const dispatch = useEngineDispatch();
  const open = usePresentation((s) => s.overlay === 'grid');
  const index = usePresentation((s) => s.index);
  const { parts } = useSections();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const totalMin = parts.reduce((sum, p) => sum + p.minutes, 0);

  return (
    <div
      className="grid-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t('chrome.grid.title')}
    >
      <div className="grid-overlay__head">
        <h2>{t('chrome.grid.title')}</h2>
        {totalMin > 0 && (
          <span className="grid-overlay__meta">
            {deck.scenes.length} שלבים · <span className="mono">{totalMin}′</span>
          </span>
        )}
        <button
          type="button"
          ref={closeRef}
          className="icon-btn"
          onClick={() => dispatch({ type: 'setOverlay', overlay: 'none' })}
          aria-label={t('chrome.close')}
        >
          <Icon name="close" />
        </button>
      </div>
      <div className="grid-overlay__cards">
        {parts.map((part) => (
          <section key={part.name} className="toc-part" style={hueStyle(part.hue)}>
            <h3 className="toc-part__name">
              {part.name}
              {part.minutes > 0 && <span className="toc-part__min mono">{part.minutes}′</span>}
            </h3>
            <ol className="toc-part__stages">
              {part.indices.map((i) => {
                const scene = deck.scenes[i]!;
                return (
                  <li key={scene.id}>
                    <button
                      type="button"
                      className={`grid-thumb${i === index ? ' is-current' : ''}`}
                      aria-current={i === index ? 'step' : undefined}
                      onClick={() => {
                        dispatch({ type: 'goToIndex', index: i });
                        dispatch({ type: 'setOverlay', overlay: 'none' });
                      }}
                    >
                      <span className="grid-thumb__n mono" dir="ltr">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="grid-thumb__title">{scene.title}</span>
                      <span className="grid-thumb__meta">{stageDetail(scene, part.name)}</span>
                      <span className="grid-thumb__budget mono" dir="ltr">
                        {scene.budgetMin ? `${scene.budgetMin}′` : ''}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
