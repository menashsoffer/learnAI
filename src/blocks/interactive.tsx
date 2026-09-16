import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { storage } from '@/persistence/storage';
import { globalKey } from '@/persistence/namespace';
import { formatClock } from '@/engine';
import { useCopy, COPY_LABEL } from './useCopy';
import type { PromptBuilderBlock, ChecklistBlock, DoNowBlock } from './types';

/**
 * The three blocks that hold participant state. They persist to localStorage per block id so
 * a draft survives navigation and reload — the prompt someone builds in stage 4 is still
 * there when they adapt it in stage 9, which is the whole reason the builder is worth having.
 */

function usePersisted<T>(key: string, initial: T): [T, (v: T) => void] {
  const full = globalKey(key);
  const [value, setValue] = useState<T>(() => storage.getJSON<T>(full, initial));
  const set = useCallback(
    (v: T) => {
      setValue(v);
      storage.setJSON(full, v);
    },
    [full],
  );
  return [value, set];
}

/** Assemble `{field}` placeholders. An unfilled field leaves its label as a visible gap. */
export function assemblePrompt(block: PromptBuilderBlock, values: Record<string, string>): string {
  return block.template.replace(/\{([a-z0-9-]+)\}/g, (_, id: string) => {
    const v = values[id]?.trim();
    if (v) return v;
    const field = block.fields.find((f) => f.id === id);
    return `[${field?.label ?? id}]`;
  });
}

export function PromptBuilder({ block }: { block: PromptBuilderBlock }) {
  const initial = useMemo(
    () => Object.fromEntries(block.fields.map((f) => [f.id, f.value ?? ''])),
    [block.fields],
  );
  const [values, setValues] = usePersisted<Record<string, string>>(
    `promptDraft:${block.id}`,
    initial,
  );
  const assembled = assemblePrompt(block, values);
  const { state: copyState, copy } = useCopy();
  const out = useRef<HTMLParagraphElement>(null);
  const filled = block.fields.filter((f) => values[f.id]?.trim()).length;

  return (
    <div className="blk-builder">
      <div className="blk-builder__fields">
        {block.fields.map((f) => (
          <label key={f.id} className="blk-builder__field">
            <span className="blk-builder__label">{f.label}</span>
            <textarea
              className="blk-builder__input"
              rows={f.rows ?? 2}
              placeholder={f.placeholder}
              value={values[f.id] ?? ''}
              onChange={(e) => setValues({ ...values, [f.id]: e.target.value })}
            />
          </label>
        ))}
      </div>

      <div className="blk-builder__out">
        <div className="blk-builder__out-head">
          <span className="blk-builder__out-label">
            הפרומפט שלכם
            <span className="blk-builder__count">
              {filled}/{block.fields.length}
            </span>
          </span>
          <button
            type="button"
            className={`blk-copy is-${copyState}`}
            onClick={() => copy(assembled, out.current)}
            aria-live="polite"
          >
            {COPY_LABEL[copyState]}
          </button>
        </div>
        <p className="blk-builder__assembled" ref={out} dir="rtl">
          {assembled}
        </p>
      </div>
      {block.hint && <p className="blk-builder__hint">{block.hint}</p>}
    </div>
  );
}

export function Checklist({ block }: { block: ChecklistBlock }) {
  const [done, setDone] = usePersisted<number[]>(`checklist:${block.id}`, []);
  const set = new Set(done);
  return (
    <div className="blk-checklist">
      {block.title && <div className="blk-checklist__title">{block.title}</div>}
      <ul className="blk-checklist__items">
        {block.items.map((item, i) => (
          <li key={i}>
            <label className={`blk-check${set.has(i) ? ' is-done' : ''}`}>
              <input
                type="checkbox"
                checked={set.has(i)}
                onChange={() => setDone(set.has(i) ? done.filter((d) => d !== i) : [...done, i])}
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The imperative line, plus an optional self-started timebox. There is no presenter sync by
 * design, so the participant starts their own countdown — a badge that says "3 דקות" and a
 * clock they control, rather than a fake mirror of the presenter's.
 */
export function DoNow({ block }: { block: DoNowBlock }) {
  const total = block.timeboxSeconds ?? 0;
  const [left, setLeft] = useState(total);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  return (
    <div className="blk-donow">
      <span className="blk-donow__tag">עכשיו</span>
      <p className="blk-donow__text">{block.text}</p>
      {total > 0 && (
        <div className={`blk-donow__box${left === 0 ? ' is-done' : ''}`}>
          <span className="blk-donow__clock" dir="ltr" aria-live="off">
            {formatClock(left)}
          </span>
          <button
            type="button"
            className="blk-donow__btn"
            onClick={() => {
              if (left === 0) {
                setLeft(total);
                setRunning(true);
              } else {
                setRunning((r) => !r);
              }
            }}
          >
            {left === 0 ? 'שוב' : running ? 'השהה' : 'התחילו'}
          </button>
        </div>
      )}
    </div>
  );
}
