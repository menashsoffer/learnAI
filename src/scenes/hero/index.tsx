import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneIllustration } from '@/assets/illustrations';

const schema = z.object({
  badge: z.string().optional(),
  motto: z.string().optional(),
  /** Small chips under the motto (e.g. the day's deliverables). */
  highlights: z.array(z.string().min(1)).optional(),
});
type Data = z.infer<typeof schema>;

/**
 * A title page. The statement is set as large as the leaf allows, flush to the start edge
 * the way a manual sets a part title; the figure sits beside it. Highlights are cut as tabs,
 * each on its own divider colour — the day's deliverables look like the sections they are.
 */
function Hero({ data, scene }: SceneProps<Data>) {
  return (
    <div className="scene-shell hero">
      <div className="hero__text">
        <h1 className="hero__title">{scene.title}</h1>
        {scene.subtitle && <p className="hero__subtitle">{scene.subtitle}</p>}
        {data.motto && <p className="hero__motto">{data.motto}</p>}
      </div>
      <SceneIllustration id={scene.image} className="hero__art" />
      {(data.highlights?.length || data.badge) && (
        <div className="hero__foot">
          {data.highlights && data.highlights.length > 0 && (
            <ol className="hero__highlights">
              {data.highlights.map((h, i) => (
                <li key={i} className="hero__chip">
                  <span className="hero__chip-n mono" dir="ltr">
                    {i + 1}
                  </span>
                  {h}
                </li>
              ))}
            </ol>
          )}
          {data.badge && <span className="hero__badge">{data.badge}</span>}
        </div>
      )}
    </div>
  );
}

export default defineScene<Data>({
  type: 'hero',
  schema,
  Component: Hero,
  defaultData: () => ({}),
});
