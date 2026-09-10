import { useEffect, useRef } from 'react';
import { usePresentation, useDeck, useEngineDispatch } from '@/react/PresentationProvider';
import { t } from '@/i18n';

/** Esc overlay: a jump grid of every scene. Overlay STATE, not a route. */
export function GridOverview() {
  const deck = useDeck();
  const dispatch = useEngineDispatch();
  const open = usePresentation((s) => s.overlay === 'grid');
  const index = usePresentation((s) => s.index);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="grid-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t('chrome.grid.title')}
    >
      <div className="grid-overlay__head">
        <h2>{t('chrome.grid.title')}</h2>
        <button
          type="button"
          ref={closeRef}
          className="icon-btn"
          onClick={() => dispatch({ type: 'setOverlay', overlay: 'none' })}
          aria-label={t('chrome.close')}
        >
          ✕
        </button>
      </div>
      <div className="grid-overlay__cards">
        {deck.scenes.map((scene, i) => (
          <button
            key={scene.id}
            type="button"
            className={`grid-thumb${i === index ? ' is-current' : ''}`}
            onClick={() => {
              dispatch({ type: 'goToIndex', index: i });
              dispatch({ type: 'setOverlay', overlay: 'none' });
            }}
          >
            <span className="grid-thumb__meta">
              {i + 1} · {scene.act}
            </span>
            <span className="grid-thumb__title">{scene.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
