import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';

const schema = z.object({
  stackLabel: z.string().min(1),
  stackDesc: z.string().min(1),
  patternLabel: z.string().min(1),
  patternDesc: z.string().min(1),
});
type Data = z.infer<typeof schema>;

function Archivist({ data, scene, api }: SceneProps<Data>) {
  return (
    <SceneShell scene={scene} align="center">
      <div className={`archivist${api.reducedMotion ? ' archivist--still' : ''}`}>
        <div className="archivist__box">
          <div className="archivist__emoji" aria-hidden="true">📚</div>
          <strong>{data.stackLabel}</strong>
          <p>{data.stackDesc}</p>
        </div>
        <div className="archivist__arrow" aria-hidden="true">←</div>
        <div className="archivist__box archivist__box--out">
          <div className="archivist__emoji" aria-hidden="true">🎯</div>
          <strong>{data.patternLabel}</strong>
          <p>{data.patternDesc}</p>
        </div>
      </div>
    </SceneShell>
  );
}

export default defineScene<Data>({
  type: 'archivist-animation',
  version: 1,
  schema,
  Component: Archivist,
  defaultData: () => ({
    stackLabel: 'פקיד הארכיון',
    stackDesc: '',
    patternLabel: 'זיהוי תבניות',
    patternDesc: '',
  }),
  presenterHints: (_d, m) => ({ cue: m.notes, estSeconds: 90 }),
});
