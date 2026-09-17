import { usePresentation, useDeck, useEngineDispatch } from '@/react/PresentationProvider';
import type { PlayerMode } from '@/react/PresentationProvider';
import { select } from '@/engine';
import { toggleFullscreen } from '@/react/useKeyboardNav';
import { useTextSize } from '@/react/useTextSize';
import { t } from '@/i18n';
import { BrandLogo } from '@/assets/brand/BrandLogo';
import { Icon } from '@/assets/icons/Icon';
import { useCurrentPart } from '@/ui/useSections';
import { TabRail } from '@/ui/rail/TabRail';
import { GridOverview } from './GridOverview';
import { useChromeInsets } from './useChromeInsets';
import { StageBar } from '@/ui/participant/StageBar';
import { StudentNav } from '@/ui/participant/StudentNav';
import './chrome.css';

const MODE_LABEL: Record<PlayerMode, string> = {
  plain: '',
  present: 'מנחה',
  study: 'משתתפים',
};

const SIZE_LABEL = { s: 'קטן', m: 'רגיל', l: 'גדול' } as const;

export function Chrome({ mode = 'plain' }: { mode?: PlayerMode }) {
  const deck = useDeck();
  const dispatch = useEngineDispatch();
  const current = usePresentation((s) => s.index + 1);
  const total = usePresentation((s) => s.count);
  const stage = usePresentation((s) => deck.scenes[s.index]?.stage ?? '');
  const canPrev = usePresentation(select.canPrev);
  const canNext = usePresentation(select.canNext);
  const { size, cycle } = useTextSize();
  const { part, style } = useCurrentPart();
  useChromeInsets();

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <>
      <header className={`topbar topbar--${mode}`} style={style}>
        <div className="topbar__main">
          <div className="topbar__brand">
            <BrandLogo mark="cadets" size="sm" />
            <span className="topbar__ministry">
              <BrandLogo mark="ministry" size="sm" />
            </span>
            {MODE_LABEL[mode] && <span className="topbar__mode">{MODE_LABEL[mode]}</span>}
          </div>

          {mode !== 'study' && (
            <div className="topbar__where">
              <span className="topbar__part">{part.name}</span>
              {stage !== part.name && <span className="topbar__stage-desktop">{stage}</span>}
              <span className="topbar__counter mono" dir="ltr">
                {pad(current)}
                <span className="topbar__counter-of">/{pad(total)}</span>
              </span>
            </div>
          )}

          <div className="topbar__nav">
            {mode === 'plain' && (
              <div className="topbar__pager" role="group" aria-label="ניווט בין סצנות">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => dispatch({ type: 'prev' })}
                  disabled={!canPrev}
                  aria-label={t('chrome.prev')}
                  title={t('chrome.prev')}
                >
                  <Icon name="prev" />
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => dispatch({ type: 'next' })}
                  disabled={!canNext}
                  aria-label={t('chrome.next')}
                  title={t('chrome.next')}
                >
                  <Icon name="next" />
                </button>
              </div>
            )}
            <button
              type="button"
              className="icon-btn icon-btn--textsize"
              title="גודל טקסט"
              aria-label={`גודל טקסט: ${SIZE_LABEL[size]}`}
              onClick={cycle}
              data-size={size}
            >
              <Icon name="text-size" />
            </button>
            <button
              type="button"
              className="icon-btn"
              title={t('chrome.grid.open')}
              aria-label={t('chrome.grid.open')}
              onClick={() => dispatch({ type: 'toggleOverlay', overlay: 'grid' })}
            >
              <Icon name="grid" />
            </button>
            <button
              type="button"
              className="icon-btn icon-btn--fullscreen"
              title={t('chrome.fullscreen')}
              aria-label={t('chrome.fullscreen')}
              onClick={() => void toggleFullscreen()}
            >
              <Icon name="fullscreen" />
            </button>
            {mode !== 'plain' && (
              <a
                className="icon-btn"
                href={`#/d/${deck.meta.id}`}
                title="יציאה למסך הפתיחה"
                aria-label="יציאה למסך הפתיחה"
              >
                <Icon name="close" />
              </a>
            )}
          </div>
        </div>
      </header>

      {mode === 'study' ? (
        <StageBar />
      ) : (
        <>
          <TabRail className="chrome-rail" />
          <TabRail orientation="horizontal" className="chrome-strip" />
        </>
      )}

      {mode === 'study' && <StudentNav />}

      <GridOverview />
    </>
  );
}
