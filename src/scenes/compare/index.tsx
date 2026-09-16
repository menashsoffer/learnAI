import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';
import { BlocksRenderer } from '@/blocks/BlocksRenderer';
import type { Block } from '@/blocks/types';

/**
 * Weak beside strong, annotated. The teaching device that carries the three prompting
 * levels: a room does not learn that a prompt improved by being told so, only by seeing
 * the two side by side and being walked through what changed.
 */
const schema = z.object({
  beforeLabel: z.string().optional(),
  afterLabel: z.string().optional(),
  before: z.string().min(1),
  after: z.string().min(1),
  notes: z.array(z.string().min(1)).optional(),
});
type Data = z.infer<typeof schema>;

function Compare({ data, scene }: SceneProps<Data>) {
  const block: Block = { kind: 'compare-pair', ...data };
  return (
    <SceneShell scene={scene} className="compare-scene">
      <BlocksRenderer blocks={[block]} />
    </SceneShell>
  );
}

export default defineScene<Data>({
  type: 'compare',
  schema,
  Component: Compare,
  defaultData: () => ({ before: '', after: '' }),
});
