import { useMemo, useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { loadDeck } from '@/engine';
import { getDeckRaw, DEFAULT_DECK_ID } from '@content/decks';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { storage } from '@/persistence/storage';
import { BrandLockup } from '@/assets/brand/BrandLogo';
import { deckKey } from '@/persistence/namespace';
import { Icon } from '@/assets/icons/Icon';
import { buildSections, hueStyle } from '@/ui/sections';
import './landing.css';

/** Two doors: presenter (soft code-gated) and participants. */
export function LandingRoute() {
  const { deckId = DEFAULT_DECK_ID } = useParams();
  const navigate = useNavigate();
  const raw = getDeckRaw(deckId);
  const deck = useMemo(() => (raw ? loadDeck(raw) : null), [raw]);
  const sections = useMemo(() => (deck ? buildSections(deck.scenes) : null), [deck]);

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
        <header className="landing__head">
          <BrandLockup size="md" />
        </header>

        <main className="landing__main">
          <div className="landing__title-block">
            <h1 className="landing__title">{deck.meta.description ?? deck.meta.title}</h1>
            {deck.meta.description && <p className="landing__desc">{deck.meta.title}</p>}
          </div>

          {!askCode ? (
            <div className="landing__doors">
              <button
                type="button"
                className="door door--study"
                style={hueStyle('grass')}
                onClick={() => navigate(`/d/${deck.meta.id}/study/${firstStudy}`)}
              >
                <span className="door__tab">במחשב</span>
                <Icon name="laptop" size={28} />
                <span className="door__label">כניסת משתתפים</span>
                <span className="door__sub">הוראות פעילות, פרומפטים להעתקה וקישורים</span>
                <span className="door__go" aria-hidden="true">
                  <Icon name="next" size={24} />
                </span>
              </button>
              <button
                type="button"
                className="door door--present"
                style={hueStyle('ultramarine')}
                onClick={enterPresenter}
              >
                <span className="door__tab">על המקרן</span>
                <Icon name="presenter" size={28} />
                <span className="door__label">כניסת מנחה</span>
                <span className="door__sub">מצגת מלאה, ניהול זמן, טיימר</span>
                <span className="door__go" aria-hidden="true">
                  <Icon name="next" size={24} />
                </span>
              </button>
            </div>
          ) : (
            <form className="landing__code" onSubmit={submitCode} style={hueStyle('ultramarine')}>
              <label htmlFor="pcode">קוד מנחה</label>
              <input
                id="pcode"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                className={`mono${err ? ' is-error' : ''}`}
                aria-invalid={err || undefined}
                aria-describedby={err ? 'pcode-err' : undefined}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setErr(false);
                }}
                autoFocus
              />
              {err && (
                <span id="pcode-err" className="landing__code-err" role="alert">
                  קוד שגוי. נסו שוב.
                </span>
              )}
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

          {sections && sections.parts.some((p) => p.minutes > 0) && (
            <section className="landing__contents" aria-label="מבנה ההרצאה">
              <ol className="landing__parts">
                {sections.parts.map((p) => (
                  <li
                    key={p.name}
                    className="landing__part"
                    style={{ ...hueStyle(p.hue), flexGrow: p.minutes || 1 }}
                  >
                    <span className="landing__part-name">{p.name}</span>
                    <span className="landing__part-min mono" dir="ltr">
                      {p.minutes}′
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </main>

        <footer className="landing__foot">
          <a className="landing__plain" href={`#/d/${deck.meta.id}/${first}`}>
            <Icon name="book" size={18} />
            צפייה רגילה במצגת
          </a>
          {deck.meta.credits && <p className="landing__credits">{deck.meta.credits}</p>}
        </footer>
      </div>
    </ThemeProvider>
  );
}
