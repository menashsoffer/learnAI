import { useMemo, useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { loadDeck } from '@/engine';
import { getDeckRaw, DEFAULT_DECK_ID } from '@content/decks';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { storage } from '@/persistence/storage';
import { BrandLockup } from '@/assets/brand/BrandLogo';
import { deckKey } from '@/persistence/namespace';
import './landing.css';

/** Two doors: presenter (soft code-gated) and participants. */
export function LandingRoute() {
  const { deckId = DEFAULT_DECK_ID } = useParams();
  const navigate = useNavigate();
  const raw = getDeckRaw(deckId);
  const deck = useMemo(() => (raw ? loadDeck(raw) : null), [raw]);

  const okKey = deck ? deckKey(deck.meta.id, 'presenterOk') : '';
  const [askCode, setAskCode] = useState(false);
  const [code, setCode] = useState('');
  const [err, setErr] = useState(false);

  if (!deck) return <Navigate to="/" replace />;
  const first = deck.order[0];
  const firstStudy = deck.scenes.find((s) => s.student != null)?.slug ?? first;

  const enterPresenter = () => {
    const required = deck.meta.presenterCode;
    const unlocked = storage.getString(okKey) === '1';
    if (!required || unlocked) {
      navigate(`/d/${deck.meta.id}/present/${first}`);
      return;
    }
    setAskCode(true);
  };

  const submitCode = (e: FormEvent) => {
    e.preventDefault();
    if (code.trim() === deck.meta.presenterCode) {
      storage.setString(okKey, '1');
      navigate(`/d/${deck.meta.id}/present/${first}`);
    } else {
      setErr(true);
    }
  };

  return (
    <ThemeProvider locale={deck.meta.locale} dir={deck.meta.dir} distance="read">
      <div className="landing">
        <div className="landing__inner">
          <BrandLockup size="lg" />
          <span className="line-motif" aria-hidden="true" />
          <h1 className="landing__title">{deck.meta.title}</h1>
          {deck.meta.description && <p className="landing__desc">{deck.meta.description}</p>}

          {!askCode ? (
            <div className="landing__doors">
              <button type="button" className="door door--present" onClick={enterPresenter}>
                <span className="door__icon" aria-hidden="true">
                  🎤
                </span>
                <span className="door__label">כניסת מנחה</span>
                <span className="door__sub">מצגת מלאה, הנחיה ומה להגיד, טיימר</span>
              </button>
              <button
                type="button"
                className="door door--study"
                onClick={() => navigate(`/d/${deck.meta.id}/study/${firstStudy}`)}
              >
                <span className="door__icon" aria-hidden="true">
                  📝
                </span>
                <span className="door__label">כניסת משתתפים</span>
                <span className="door__sub">הוראות פעילות, פרומפטים להעתקה וקישורים</span>
              </button>
            </div>
          ) : (
            <form className="landing__code" onSubmit={submitCode}>
              <label htmlFor="pcode">קוד מנחה</label>
              <input
                id="pcode"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setErr(false);
                }}
                autoFocus
              />
              {err && <span className="landing__code-err">קוד שגוי</span>}
              <div className="landing__code-actions">
                <button type="submit" className="btn-action">
                  כניסה
                </button>
                <button
                  type="button"
                  className="btn-action btn-action--ghost"
                  onClick={() => setAskCode(false)}
                >
                  חזרה
                </button>
              </div>
            </form>
          )}

          <a className="landing__plain" href={`#/d/${deck.meta.id}/${first}`}>
            צפייה רגילה במצגת ←
          </a>

          {deck.meta.credits && <p className="landing__credits">{deck.meta.credits}</p>}
        </div>
      </div>
    </ThemeProvider>
  );
}
