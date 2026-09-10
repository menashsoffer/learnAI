import { usePresentation, useDeck, useEngineDispatch } from '@/react/PresentationProvider';
import { select } from '@/engine';
import { toggleFullscreen } from '@/react/useKeyboardNav';
import { t } from '@/i18n';
import { GridOverview } from './GridOverview';
import { PresenterNotesDrawer } from './PresenterNotesDrawer';
import './chrome.css';

export function Chrome() {
  const deck = useDeck();
  const dispatch = useEngineDispatch();
  const current = usePresentation((s) => s.index + 1);
  const total = usePresentation((s) => s.count);
  const progress = usePresentation(select.progress);
  const act = usePresentation((s) => deck.scenes[s.index]?.act ?? '');
  const canPrev = usePresentation(select.canPrev);
  const canNext = usePresentation(select.canNext);

  return (
    <>
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__badge">{deck.meta.title}</span>
        </div>
        <div className="topbar__nav">
          <span className="topbar__counter">
            <span className="topbar__act">{act}</span>
            {t('chrome.sceneCounter', { current, total })}
          </span>
          <button
            type="button"
            className="icon-btn"
            title={t('chrome.grid.open')}
            aria-label={t('chrome.grid.open')}
            onClick={() => dispatch({ type: 'toggleOverlay', overlay: 'grid' })}
          >
            ▦
          </button>
          <button
            type="button"
            className="icon-btn"
            title={t('chrome.notes.open')}
            aria-label={t('chrome.notes.open')}
            onClick={() => dispatch({ type: 'toggleOverlay', overlay: 'notes' })}
          >
            ✎
          </button>
          <button
            type="button"
            className="icon-btn"
            title={t('chrome.fullscreen')}
            aria-label={t('chrome.fullscreen')}
            onClick={() => void toggleFullscreen()}
          >
            ⤢
          </button>
        </div>
        <div className="topbar__progress" aria-hidden="true">
          <span className="topbar__progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </header>

      <nav className="bottomnav" aria-label={t('chrome.next')}>
        <button
          type="button"
          className="bottomnav__btn"
          onClick={() => dispatch({ type: 'prev' })}
          disabled={!canPrev}
          aria-label={t('chrome.prev')}
        >
          ›
        </button>
        <button
          type="button"
          className="bottomnav__btn"
          onClick={() => dispatch({ type: 'next' })}
          disabled={!canNext}
          aria-label={t('chrome.next')}
        >
          ‹
        </button>
      </nav>

      <GridOverview />
      <PresenterNotesDrawer />
    </>
  );
}
