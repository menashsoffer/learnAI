import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';

const schema = z.object({
  columns: z
    .array(
      z.object({
        title: z.string().min(1),
        tone: z.enum(['success', 'warning', 'danger', 'info', 'neutral']).optional(),
        body: z.string().min(1),
      }),
    )
    .length(2),
});
type Data = z.infer<typeof schema>;

function TwoColumn({ data, scene }: SceneProps<Data>) {
  return (
    <SceneShell scene={scene}>
      <div className="two-col">
        {data.columns.map((col, i) => (
          <div key={i} className={`two-col__card tone-${col.tone ?? 'neutral'}`}>
            <div className="two-col__title">{col.title}</div>
            <p className="two-col__body">{col.body}</p>
          </div>
        ))}
      </div>
    </SceneShell>
  );
}

export default defineScene<Data>({
  type: 'two-column',
  version: 1,
  schema,
  Component: TwoColumn,
  defaultData: () => ({
    columns: [
      { title: 'עמודה א', body: '', tone: 'success' },
      { title: 'עמודה ב', body: '', tone: 'warning' },
    ],
  }),
  presenterHints: (_d, m) => ({ cue: m.notes, estSeconds: 90 }),
});
