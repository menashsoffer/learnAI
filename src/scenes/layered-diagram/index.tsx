import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';

const schema = z.object({
  layers: z
    .array(
      z.object({
        label: z.string().min(1),
        desc: z.string().min(1),
        highlight: z.boolean().optional(),
      }),
    )
    .min(2),
});
type Data = z.infer<typeof schema>;

function LayeredDiagram({ data, scene }: SceneProps<Data>) {
  return (
    <SceneShell scene={scene}>
      <ol className="layers">
        {data.layers.map((l, i) => (
          <li key={i} className={`layer-card${l.highlight ? ' layer-card--hl' : ''}`}>
            <span className="layer-card__num" aria-hidden="true">{i + 1}</span>
            <div>
              <strong className="layer-card__label">{l.label}</strong>
              <p className="layer-card__desc">{l.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </SceneShell>
  );
}

export default defineScene<Data>({
  type: 'layered-diagram',
  version: 1,
  schema,
  Component: LayeredDiagram,
  defaultData: () => ({
    layers: [
      { label: 'שכבה 1', desc: '' },
      { label: 'שכבה 2', desc: '' },
    ],
  }),
  presenterHints: (_d, m) => ({ cue: m.notes, estSeconds: 180 }),
});
