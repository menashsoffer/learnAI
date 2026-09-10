import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';
import { formatClock } from '@/engine';

const schema = z.object({
  question: z.string().min(1),
  placeholder: z.string().min(1),
  writeSeconds: z.number().int().positive().optional(),
});
type Data = z.infer<typeof schema>;

function WarmupInput({ data, scene, api }: SceneProps<Data>) {
  const [value, setValue] = useState(() => api.getPersisted<string>('answer', ''));
  const [saved, setSaved] = useState(false);
  const [left, setLeft] = useState<number | null>(data.writeSeconds ?? null);
  const [running, setRunning] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!running || left == null) return;
    if (left <= 0) {
      setRunning(false);
      return;
    }
    const id = setTimeout(() => setLeft((n) => (n == null ? n : n - 1)), 1000);
    return () => clearTimeout(id);
  }, [running, left]);

  const onChange = (v: string) => {
    setValue(v);
    api.persist('answer', v);
    setSaved(true);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSaved(false), 1800);
  };

  return (
    <SceneShell scene={scene} align="center">
      <p className="warmup__question">{data.question}</p>

      {data.writeSeconds != null && (
        <div className="warmup__timer">
          <span className="warmup__clock">{formatClock(left ?? data.writeSeconds)}</span>
          <button
            type="button"
            className="btn-action btn-action--ghost"
            onClick={() => {
              setRunning((r) => !r);
              if (left == null || left <= 0) setLeft(data.writeSeconds!);
            }}
          >
            {running ? 'עצור' : 'התחל 60 שנ׳'}
          </button>
        </div>
      )}

      <div className="warmup__field">
        <textarea
          className="warmup__textarea"
          value={value}
          placeholder={data.placeholder}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
        />
        <span className={`warmup__saved${saved ? ' is-on' : ''}`}>✓ נשמר במכשיר שלך בלבד</span>
      </div>
    </SceneShell>
  );
}

export default defineScene<Data>({
  type: 'warmup-input',
  version: 1,
  schema,
  Component: WarmupInput,
  defaultData: () => ({ question: '', placeholder: 'הקלד/י כאן…', writeSeconds: 60 }),
  capabilities: { interactive: true },
  presenterHints: (_d, m) => ({ cue: m.notes, estSeconds: 180 }),
});
