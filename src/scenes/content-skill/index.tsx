import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';
import { BlocksRenderer } from '@/blocks/BlocksRenderer';
import { blocksSchema } from '@/blocks/schema';
import type { Block } from '@/blocks/types';
import { SceneIllustration } from '@/illustrations';

const schema = z.object({
  badge: z.string().optional(),
  blocks: blocksSchema,
});
type Data = z.infer<typeof schema>;

function ContentSkill({ data, scene }: SceneProps<Data>) {
  const blocks = <BlocksRenderer blocks={data.blocks as Block[]} />;
  return (
    <SceneShell scene={scene} className={`content-skill${scene.image ? ' has-illus' : ''}`}>
      {data.badge && <span className="pill">{data.badge}</span>}
      {scene.image ? (
        <div className="scene-illus-row">
          <SceneIllustration id={scene.image} />
          {blocks}
        </div>
      ) : (
        blocks
      )}
    </SceneShell>
  );
}

export default defineScene<Data>({
  type: 'content-skill',
  version: 1,
  schema,
  Component: ContentSkill,
  defaultData: () => ({ blocks: [] }),
  presenterHints: (_d, m) => ({ cue: m.notes, estSeconds: 180 }),
});
