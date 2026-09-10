import { usePresentation, useDeck, useEngineDispatch } from '@/react/PresentationProvider';
import type { PlayerMode } from '@/react/PresentationProvider';
import { select } from '@/engine';
import { toggleFullscreen } from '@/react/useKeyboardNav';
import { useTextSize } from '@/react/useTextSize';
import { t } from '@/i18n';
import { GridOverview } from './GridOverview';
import { PresenterNotesDrawer } from './PresenterNotesDrawer';
import './chrome.css';

const MODE_LABEL: Record<PlayerMode, string> = {
  plain: '',
  present: 'מנחה',
  study: 'משתתפים',
};

export function Chrome({ mode = 'plain' }: { mode?: PlayerMode }) {
  const deck = useDeck();
  const dispatch = useEngineDispatch();
  const current = usePresentation((s) => s.index + 1);
  const total = usePresentation((s) => s.count);
  const progress = usePresentation(select.progress);
  const act = usePresentation((s) => deck.scenes[s.index]?.act ?? '');
  const canPrev = usePresentation(select.canPrev);
  const canNext = usePresentation(select.canNext);
  const { size, cycle } = useTextSize();

  return (
    <>
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__badge">{deck.meta.title}</span>
          {MODE_LABEL[mode] && <span className="topbar__mode">{MODE_LABEL[mode]}</span>}
        </div>
        <div className="topbar__nav">
          <span className="topbar__counter" dir="ltr">
            <span className="topbar__act" dir="rtl">{act}</span>
            {current} / {total}
          </span>
          <button
            type="button"
            className="icon-btn"
            title="גודל טקסט"
            aria-label={`גודל טקסט (${size.toUpperCase()})`}
            onClick={cycle}
          >
            {size === 's' ? 'א' : size === 'l' ? 'א+' : 'א'}
          </button>
          <button
            type="button"
            className="icon-btn"
            title={t('chrome.grid.open')}
            aria-label={t('chrome.grid.open')}
            onClick={() => dispatch({ type: 'toggleOverlay', overlay: 'grid' })}
          >
            ▦
          </button>
          {mode !== 'study' && (
            <button
              type="button"
              className="icon-btn"
              title={t('chrome.notes.open')}
              aria-label={t('chrome.notes.open')}
              onClick={() => dispatch({ type: 'toggleOverlay', overlay: 'notes' })}
            >
              ✎
            </button>
          )}
          <button
            type="button"
            className="icon-btn"
            title={t('chrome.fullscreen')}
            aria-label={t('chrome.fullscreen')}
            onClick={() => void toggleFullscreen()}
          >
            ⤢
          </button>
          {mode !== 'plain' && (
            <a
              className="icon-btn"
              href={`#/d/${deck.meta.id}`}
              title="יציאה למסך הפתיחה"
              aria-label="יציאה למסך הפתיחה"
            >
              ⨯
            </a>
          )}
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
      {mode !== 'study' && <PresenterNotesDrawer />}
    </>
  );
}
