import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SelfReadingBox, LineMotif } from '../_shared/SceneShell';

const schema = z.object({
  unit: z.string().optional(),
});
type Data = z.infer<typeof schema>;

function SectionCover({ data, scene }: SceneProps<Data>) {
  return (
    <div className="scene-shell align-center section-cover">
      <LineMotif />
      {data.unit && <div className="section-cover__unit">{data.unit}</div>}
      <h1 className="section-cover__title">{scene.title}</h1>
      {scene.subtitle && <p className="section-cover__subtitle">{scene.subtitle}</p>}
      <SelfReadingBox text={scene.selfReading} />
    </div>
  );
}

export default defineScene<Data>({
  type: 'section-cover',
  version: 1,
  schema,
  Component: SectionCover,
  defaultData: () => ({}),
  presenterHints: (_d, m) => ({ cue: m.notes, estSeconds: 15 }),
});
