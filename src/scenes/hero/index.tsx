import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SelfReadingBox, LineMotif } from '../_shared/SceneShell';
import { SceneIllustration } from '@/illustrations';

const schema = z.object({
  badge: z.string().optional(),
  motto: z.string().optional(),
  /** Small chips under the motto (e.g. the day's deliverables). */
  highlights: z.array(z.string().min(1)).optional(),
});
type Data = z.infer<typeof schema>;

function Hero({ data, scene }: SceneProps<Data>) {
  return (
    <div className="scene-shell align-center hero">
      <LineMotif />
      <SceneIllustration id={scene.image} />
      {data.badge && <div className="hero__badge">{data.badge}</div>}
      <h1 className="hero__title">{scene.title}</h1>
      {scene.subtitle && <p className="hero__subtitle">{scene.subtitle}</p>}
      {data.motto && <p className="hero__motto">{data.motto}</p>}
      {data.highlights && data.highlights.length > 0 && (
        <div className="hero__highlights">
          {data.highlights.map((h, i) => (
            <span key={i} className="hero__chip">
              {h}
            </span>
          ))}
        </div>
      )}
      <SelfReadingBox text={scene.selfReading} />
    </div>
  );
}

export default defineScene<Data>({
  type: 'hero',
  version: 1,
  schema,
  Component: Hero,
  defaultData: () => ({}),
  presenterHints: (_d, m) => ({ cue: m.notes, estSeconds: 30 }),
});
