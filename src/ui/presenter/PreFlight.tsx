import { useMemo } from 'react';
import { useDeck, useEngineDispatch, usePresentation } from '@/react/PresentationProvider';
import { usePacingPlan } from '@/react/usePacing';
import { Icon } from '@/assets/icons/Icon';
import { useSections } from '@/ui/useSections';
import { hueStyle } from '@/ui/sections';
import { useCopy } from '@/blocks/useCopy';
import { QrCode } from './QrCode';
import './preflight.css';

/**
 * THE MINUTE BEFORE THE LECTURE.
 *
 * Everything the presenter needs before saying a word, on one screen: how the room gets in,
 * and the whole shape of the next 90 minutes.
 *
 * "התחל הרצאה" starts the session clock. Nothing else does — the drift reading is only
 * trustworthy if the clock starts when the talking starts.
 */
export function PreFlight({ onStart }: { onStart: () => void }) {
  const deck = useDeck();
  const plan = usePacingPlan();
  const dispatch = useEngineDispatch();
  const status = usePresentation((s) => s.session.status);
  const { parts, partIndex } = useSections();
  const bySlug = useMemo(
    () => new Map(deck.scenes.map((s, i) => [s.slug, parts[partIndex[i] ?? 0]!])),
    [deck, parts, partIndex],
  );

  const { state: copyState, copy } = useCopy();

  const start = () => {
    dispatch({ type: 'session/start' });
    onStart();
  };

  const copyUrl = () => {
    if (deck.meta.participantUrl) copy(deck.meta.participantUrl);
  };

  return (
    <div className="preflight" data-distance-scope="glance">
      <header className="preflight__head">
        <h1 className="preflight__title">{deck.meta.description ?? deck.meta.title}</h1>
        {deck.meta.description && <p className="preflight__sub">{deck.meta.title}</p>}
      </header>

      <div className="preflight__grid">
        {deck.meta.participantUrl && (
          <section className="preflight__col">
            <h2 className="preflight__h2">כניסת משתתפים</h2>
            <div className="preflight__join-card">
              <div className="preflight__join-qr">
                <QrCode value={deck.meta.participantUrl} size={168} />
                <span className="preflight__qr-caption">לסריקה מנייד</span>
              </div>
              <div className="preflight__join-body">
                <span className="preflight__join-label">או מהדפדפן במחשב:</span>
                <code className="preflight__join-url mono" dir="ltr">
                  {deck.meta.participantUrl}
                </code>
                <div className="preflight__join-actions">
                  <button type="button" className="btn-action btn-action--sm" onClick={copyUrl}>
                    <Icon name={copyState === 'copied' ? 'check' : 'copy'} size={16} />
                    <span>{copyState === 'copied' ? 'הועתק!' : 'העתקת קישור'}</span>
                  </button>
                  <a
                    href={deck.meta.participantUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-action btn-action--ghost btn-action--sm"
                    title="פתיחת מסך המשתתף בלשונית חדשה"
                  >
                    פתח בלשונית
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="preflight__col">
          <h2 className="preflight__h2">הריצה</h2>
          {/* The session drawn to scale: each stage a tab as wide as its minutes. */}
          <div className="preflight__bar" aria-hidden="true">
            {plan.stages.map((s) => (
              <span
                key={s.slug}
                className={`preflight__bar-tab${s.optional ? ' is-optional' : ''}`}
                style={{ ...hueStyle(bySlug.get(s.slug)?.hue ?? 'yellow'), flexGrow: s.budgetMin }}
              />
            ))}
          </div>
          <div className="preflight__run-head" aria-hidden="true">
            <span>מתי</span>
            <span>שלב</span>
            <span>דק׳</span>
          </div>
          <ol className="preflight__run">
            {plan.stages.map((s) => {
              const part = bySlug.get(s.slug);
              return (
                <li
                  key={s.slug}
                  className={`preflight__stage${s.optional ? ' is-optional' : ''}${part && part.first === deck.scenes.findIndex((x) => x.slug === s.slug) ? ' is-part-start' : ''}`}
                  style={part ? hueStyle(part.hue) : undefined}
                >
                  <span className="preflight__stage-min mono" dir="ltr">
                    {s.startMin}′
                  </span>
                  <span className="preflight__stage-name">
                    {s.stage}
                    {s.optional && <span className="preflight__stage-tag">רשות</span>}
                  </span>
                  <span className="preflight__stage-budget mono" dir="ltr">
                    {s.budgetMin}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <div className="preflight__actions">
        <button type="button" className="btn-action preflight__start" onClick={start}>
          <Icon name="play" size={20} />
          {status === 'idle' ? 'התחל הרצאה' : 'המשך'}
        </button>
        <button type="button" className="btn-action btn-action--ghost" onClick={onStart}>
          דלג — בלי שעון
        </button>
      </div>
    </div>
  );
}
