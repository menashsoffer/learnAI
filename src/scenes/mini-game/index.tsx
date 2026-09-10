import { useState } from 'react';
import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';

const schema = z.object({
  prompt: z.string().min(1),
  options: z
    .array(z.object({ label: z.string().min(1), correct: z.boolean() }))
    .min(2),
  explanation: z.string().min(1),
});
type Data = z.infer<typeof schema>;

function MiniGame({ data, scene, api }: SceneProps<Data>) {
  const prev = api.getPersisted<{ choice: number } | null>('answer', null);
  const [choice, setChoice] = useState<number | null>(prev?.choice ?? null);
  const answered = choice != null;
  const correct = answered ? data.options[choice].correct : false;

  const pick = (i: number) => {
    if (answered) return;
    setChoice(i);
    api.persist('answer', { choice: i, correct: data.options[i].correct });
    api.track('minigame_answer', { slug: scene.slug, correct: data.options[i].correct });
  };

  return (
    <SceneShell scene={scene} align="center">
      <div className="game">
        <blockquote className="game__prompt">{data.prompt}</blockquote>
        <div className="game__options">
          {data.options.map((opt, i) => {
            const state = !answered
              ? ''
              : i === choice
                ? opt.correct
                  ? ' is-correct'
                  : ' is-wrong'
                : opt.correct
                  ? ' is-correct'
                  : '';
            return (
              <button
                key={i}
                type="button"
                className={`game__opt${state}`}
                onClick={() => pick(i)}
                disabled={answered}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {answered && (
          <p className={`game__feedback${correct ? ' is-correct' : ' is-wrong'}`}>
            {correct ? '✅ ' : '❌ '}
            {data.explanation}
          </p>
        )}
      </div>
    </SceneShell>
  );
}

export default defineScene<Data>({
  type: 'mini-game',
  version: 1,
  schema,
  Component: MiniGame,
  defaultData: () => ({
    prompt: '',
    options: [
      { label: 'א', correct: true },
      { label: 'ב', correct: false },
    ],
    explanation: '',
  }),
  capabilities: { interactive: true },
  presenterHints: (_d, m) => ({ cue: m.notes, estSeconds: 240, advanceOn: 'interaction' }),
});
