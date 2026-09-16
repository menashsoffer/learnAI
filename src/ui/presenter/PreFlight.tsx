import { useDeck, useEngineDispatch, usePresentation } from '@/react/PresentationProvider';
import { usePacingPlan } from '@/react/usePacing';
import { QrCode } from './QrCode';
import './preflight.css';

/**
 * THE MINUTE BEFORE THE LECTURE.
 *
 * Everything the presenter needs before saying a word, on one screen: what must be ready,
 * how the room gets in, and the whole shape of the next 90 minutes. This is the run sheet
 * that used to live in a markdown file nobody could open while standing up.
 *
 * "התחל הרצאה" starts the session clock. Nothing else does — the drift reading is only
 * trustworthy if the clock starts when the talking starts.
 */
export function PreFlight({ onStart }: { onStart: () => void }) {
  const deck = useDeck();
  const plan = usePacingPlan();
  const dispatch = useEngineDispatch();
  const status = usePresentation((s) => s.session.status);

  const required = (deck.meta.prepChecklist ?? []).filter((p) => p.required);
  const optional = (deck.meta.prepChecklist ?? []).filter((p) => !p.required);

  const start = () => {
    dispatch({ type: 'session/start' });
    onStart();
  };

  return (
    <div className="preflight" data-distance-scope="glance">
      <header className="preflight__head">
        <h1 className="preflight__title">{deck.meta.title}</h1>
        <p className="preflight__sub">
          {plan.stages.length} שלבים · {plan.plannedMin} דקות מתוקצבות מתוך {plan.totalMin}
          {plan.slackMin >= 0 ? (
            <span className="preflight__slack"> · {plan.slackMin} דקות באפר</span>
          ) : (
            <span className="preflight__slack preflight__slack--over">
              {' '}
              · חריגה של {-plan.slackMin} דקות בתכנון עצמו
            </span>
          )}
        </p>
      </header>

      <div className="preflight__grid">
        <section className="preflight__col">
          <h2 className="preflight__h2">לפני שמתחילים</h2>
          {required.length > 0 && (
            <ul className="preflight__prep">
              {required.map((p, i) => (
                <li key={i} className="preflight__prep-item preflight__prep-item--req">
                  <span className="preflight__prep-flag">חובה</span>
                  <div>
                    <div className="preflight__prep-label">{p.label}</div>
                    {p.note && <div className="preflight__prep-note">{p.note}</div>}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {optional.length > 0 && (
            <ul className="preflight__prep">
              {optional.map((p, i) => (
                <li key={i} className="preflight__prep-item">
                  <span className="preflight__prep-flag preflight__prep-flag--opt">מומלץ</span>
                  <div className="preflight__prep-label">{p.label}</div>
                </li>
              ))}
            </ul>
          )}

          {deck.meta.participantUrl && (
            <div className="preflight__qr">
              <h2 className="preflight__h2">כניסת משתתפים</h2>
              <QrCode value={deck.meta.participantUrl} size={200} />
              <p className="preflight__qr-note">
                הקרינו את הקוד בזמן הפתיחה. הם סורקים ונכנסים למסך שלהם.
              </p>
            </div>
          )}
        </section>

        <section className="preflight__col">
          <h2 className="preflight__h2">הריצה</h2>
          <div className="preflight__run-head" aria-hidden="true">
            <span>מתי</span>
            <span>שלב</span>
            <span>דק׳</span>
          </div>
          <ol className="preflight__run">
            {plan.stages.map((s) => (
              <li key={s.slug} className={`preflight__stage${s.optional ? ' is-optional' : ''}`}>
                <span className="preflight__stage-min" dir="ltr">
                  {s.startMin}′
                </span>
                <span className="preflight__stage-name">
                  {s.stage}
                  {s.optional && <span className="preflight__stage-tag">רשות</span>}
                </span>
                <span className="preflight__stage-budget" dir="ltr">
                  {s.budgetMin}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <div className="preflight__actions">
        <button type="button" className="btn-action preflight__start" onClick={start}>
          {status === 'idle' ? '▶ התחל הרצאה' : '▶ המשך'}
        </button>
        <button type="button" className="btn-action btn-action--ghost" onClick={onStart}>
          דלג — בלי שעון
        </button>
      </div>
    </div>
  );
}
