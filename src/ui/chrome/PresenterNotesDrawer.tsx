import { usePresentation, useDeck, useEngineDispatch } from '@/react/PresentationProvider';
import { t } from '@/i18n';

/** `N` drawer: presenter cue for the active scene. Hidden from print + not part of the URL. */
export function PresenterNotesDrawer() {
  const deck = useDeck();
  const dispatch = useEngineDispatch();
  const open = usePresentation((s) => s.overlay === 'notes');
  const index = usePresentation((s) => s.index);
  const scene = deck.scenes[index];

  return (
    <aside className={`notes-drawer${open ? ' is-open' : ''}`} aria-hidden={!open}>
      <div className="notes-drawer__head">
        <strong>{t('chrome.notes.title')}</strong>
        <button
          type="button"
          className="icon-btn"
          onClick={() => dispatch({ type: 'setOverlay', overlay: 'none' })}
          aria-label={t('chrome.close')}
        >
          ✕
        </button>
      </div>
      <p className="notes-drawer__body">{scene?.notes || t('chrome.notes.empty')}</p>
    </aside>
  );
}
