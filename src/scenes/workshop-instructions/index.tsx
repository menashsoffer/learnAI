import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';
import { BlocksRenderer } from '@/blocks/BlocksRenderer';
import { blocksSchema } from '@/blocks/schema';
import type { Block } from '@/blocks/types';

const schema = z.object({
  blocks: blocksSchema,
});
type Data = z.infer<typeof schema>;

function WorkshopInstructions({ data, scene, api }: SceneProps<Data>) {
  return (
    <SceneShell scene={scene} className="workshop-instructions">
      {!api.online && (
        <div className="blk-callout tone-warning">
          <div className="blk-callout__title">שלב זה דורש חיבור לאינטרנט</div>
          <p className="blk-callout__text">
            הקישור לכלי ה-AI ייפתח בלשונית חדשה. שאר האתר פועל גם ללא רשת.
          </p>
        </div>
      )}
      <BlocksRenderer blocks={data.blocks as Block[]} />
    </SceneShell>
  );
}

export default defineScene<Data>({
  type: 'workshop-instructions',
  version: 1,
  schema,
  Component: WorkshopInstructions,
  defaultData: () => ({ blocks: [] }),
  capabilities: { external: true },
  presenterHints: (_d, m) => ({ cue: m.notes, estSeconds: 120, advanceOn: 'click' }),
});
