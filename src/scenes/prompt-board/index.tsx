import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';

/**
 * ONE prompt, at projector scale, and nothing else.
 *
 * This is the scene that stays up while the presenter alt-tabs to the real AI tool and
 * demonstrates live. The deck's job at that moment is to get out of the way and hold the
 * text steady so the room can read what was typed — not to compete with the demo.
 */
const schema = z.object({
  label: z.string().optional(),
  prompt: z.string().min(1),
  /** Fragments to mark inside the prompt — the components being pointed at. */
  highlight: z.array(z.string().min(1)).optional(),
  caption: z.string().optional(),
});
type Data = z.infer<typeof schema>;

function PromptBoard({ data }: SceneProps<Data>) {
  return (
    <div className="scene-shell prompt-board">
      <figure className="prompt-board__sheet">
        {data.label && <figcaption className="prompt-board__label">{data.label}</figcaption>}
        <p className="prompt-board__text" dir="rtl">
          {mark(data.prompt, data.highlight ?? [])}
        </p>
      </figure>
      {data.caption && <p className="prompt-board__caption">{data.caption}</p>}
    </div>
  );
}

/**
 * Highlight authored fragments without any HTML injection — the text is split on the
 * fragments and reassembled as elements, so `dangerouslySetInnerHTML` is never needed.
 */
function mark(text: string, fragments: string[]) {
  if (fragments.length === 0) return text;
  const pattern = fragments
    .filter(Boolean)
    .map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  if (!pattern) return text;
  return text.split(new RegExp(`(${pattern})`, 'g')).map((part, i) =>
    fragments.includes(part) ? (
      <mark key={i} className="prompt-board__mark">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default defineScene<Data>({
  type: 'prompt-board',
  schema,
  Component: PromptBoard,
  defaultData: () => ({ prompt: '' }),
});
