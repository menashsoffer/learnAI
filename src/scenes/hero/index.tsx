import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SelfReadingBox, LineMotif } from '../_shared/SceneShell';

const schema = z.object({
  badge: z.string().optional(),
  motto: z.string().optional(),
});
type Data = z.infer<typeof schema>;

function Hero({ data, scene }: SceneProps<Data>) {
  return (
    <div className="scene-shell align-center hero">
      <LineMotif />
      {data.badge && <div className="hero__badge">{data.badge}</div>}
      <h1 className="hero__title">{scene.title}</h1>
      {scene.subtitle && <p className="hero__subtitle">{scene.subtitle}</p>}
      {data.motto && <p className="hero__motto">{data.motto}</p>}
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
