import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';
import { BlocksRenderer } from '@/blocks/BlocksRenderer';
import { blocksSchema } from '@/blocks/schema';
import type { Block } from '@/blocks/types';
import { SceneIllustration } from '@/assets/illustrations';

/**
 * A teaching scene.
 *
 * `whyPublic` is REQUIRED, not optional, and that is the point: for this audience a
 * capability has to land as a municipal consequence, never as a feature. Making the field
 * mandatory means a scene that skips the "so what" cannot be authored in the first place.
 */
const schema = z.object({
  badge: z.string().optional(),
  whyPublic: z
    .string()
    .min(1, 'every concept must say why it matters in public-sector work')
    .max(160, 'one sentence — this is a line on a slide, not a paragraph'),
  blocks: blocksSchema,
});
type Data = z.infer<typeof schema>;

function Concept({ data, scene }: SceneProps<Data>) {
  return (
    <SceneShell
      scene={scene}
      className="concept"
      media={scene.image ? <SceneIllustration id={scene.image} /> : undefined}
    >
      {data.badge && <span className="pill">{data.badge}</span>}
      <p className="concept__why">
        <span className="concept__why-label">למה זה חשוב בעבודה ציבורית</span>
        {data.whyPublic}
      </p>
      <BlocksRenderer blocks={data.blocks as Block[]} />
    </SceneShell>
  );
}

export default defineScene<Data>({
  type: 'concept',
  schema,
  Component: Concept,
  defaultData: () => ({ whyPublic: '', blocks: [] }),
});
