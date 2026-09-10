import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';

const schema = z.object({
  cards: z
    .array(
      z.object({
        icon: z.string().optional(),
        title: z.string().min(1),
        body: z.string().min(1),
      }),
    )
    .min(1),
});
type Data = z.infer<typeof schema>;

function Cards({ data, scene, api }: SceneProps<Data>) {
  // Progressive reveal: when maxPhase > 0, cards appear one phase at a time.
  const revealed = api.maxPhase > 0 ? api.phase + 1 : data.cards.length;
  return (
    <SceneShell scene={scene}>
      <div className="cards-grid">
        {data.cards.map((c, i) => (
          <article key={i} className={`info-card${i < revealed ? '' : ' info-card--hidden'}`}>
            {c.icon && <div className="info-card__icon" aria-hidden="true">{c.icon}</div>}
            <h3 className="info-card__title">{c.title}</h3>
            <p className="info-card__body">{c.body}</p>
          </article>
        ))}
      </div>
    </SceneShell>
  );
}

export default defineScene<Data>({
  type: 'click-reveal-cards',
  version: 1,
  schema,
  Component: Cards,
  defaultData: () => ({ cards: [{ title: 'כרטיס', body: 'תוכן' }] }),
  presenterHints: (_d, m) => ({ cue: m.notes, estSeconds: 120 }),
});
