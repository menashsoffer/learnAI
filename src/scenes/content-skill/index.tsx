import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';
import { BlocksRenderer } from '@/blocks/BlocksRenderer';
import { blocksSchema } from '@/blocks/schema';
import type { Block } from '@/blocks/types';
import { SceneIllustration } from '@/assets/illustrations';

const schema = z.object({
  badge: z.string().optional(),
  blocks: blocksSchema,
});
type Data = z.infer<typeof schema>;

function ContentSkill({ data, scene }: SceneProps<Data>) {
  return (
    <SceneShell
      scene={scene}
      className="content-skill"
      media={scene.image ? <SceneIllustration id={scene.image} /> : undefined}
    >
      {data.badge && <span className="pill">{data.badge}</span>}
      <BlocksRenderer blocks={data.blocks as Block[]} />
    </SceneShell>
  );
}

export default defineScene<Data>({
  type: 'content-skill',
  schema,
  Component: ContentSkill,
  defaultData: () => ({ blocks: [] }),
});
