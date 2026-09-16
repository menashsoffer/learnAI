import { describe, it, expect } from 'vitest';
import { blocksSchema } from './schema';
import { assemblePrompt } from './interactive';
import type { PromptBuilderBlock } from './types';

const ok = (blocks: unknown[]) => blocksSchema.safeParse(blocks).success;
const why = (blocks: unknown[]) => {
  const r = blocksSchema.safeParse(blocks);
  if (r.success) throw new Error('expected a validation failure');
  return r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' | ');
};

describe('table blocks', () => {
  const headers = ['מושג', 'מה זה', 'דוגמה'];

  it('accepts rows whose width matches the headers', () => {
    expect(ok([{ kind: 'table', headers, rows: [['Skill', 'יכולת', 'תקציר']] }])).toBe(true);
  });

  it('REJECTS a ragged row, which would render as a silently broken grid', () => {
    expect(why([{ kind: 'table', headers, rows: [['Skill', 'יכולת']] }])).toMatch(
      /2 cells, expected 3/,
    );
  });

  it('catches a ragged table nested inside columns', () => {
    expect(
      why([
        {
          kind: 'columns',
          columns: [{ blocks: [{ kind: 'table', headers, rows: [['a', 'b', 'c', 'd']] }] }],
        },
      ]),
    ).toMatch(/4 cells, expected 3/);
  });

  it('catches a ragged table nested inside details', () => {
    expect(
      why([
        { kind: 'details', summary: 'עוד', blocks: [{ kind: 'table', headers, rows: [['a']] }] },
      ]),
    ).toMatch(/1 cells, expected 3/);
  });
});

describe('prompt-builder blocks', () => {
  const base = {
    kind: 'prompt-builder',
    id: 'four-parts',
    fields: [
      { id: 'role', label: 'תפקיד' },
      { id: 'task', label: 'משימה' },
    ],
    template: 'אתה {role}.\nמשימה: {task}.',
  };

  it('accepts a builder whose fields and template agree', () => {
    expect(ok([base])).toBe(true);
  });

  it('REJECTS a template referencing a field that does not exist', () => {
    expect(why([{ ...base, template: 'אתה {role}. הקשר: {context}.' }])).toMatch(
      /\{context\} but no field declares/,
    );
  });

  it('REJECTS a field the template never uses — the participant would fill it for nothing', () => {
    expect(why([{ ...base, fields: [...base.fields, { id: 'format', label: 'פורמט' }] }])).toMatch(
      /"format" never appears/,
    );
  });

  it('is not allowed inside details, where the one interaction would be hidden', () => {
    expect(ok([{ kind: 'details', summary: 'עוד', blocks: [base] }])).toBe(false);
  });
});

describe('assemblePrompt', () => {
  const block: PromptBuilderBlock = {
    kind: 'prompt-builder',
    id: 'four-parts',
    fields: [
      { id: 'role', label: 'תפקיד' },
      { id: 'task', label: 'משימה' },
    ],
    template: 'אתה {role}.\nמשימה: {task}.',
  };

  it('substitutes what the participant typed', () => {
    expect(assemblePrompt(block, { role: 'מנהל קהילה', task: 'נסח מכתב' })).toBe(
      'אתה מנהל קהילה.\nמשימה: נסח מכתב.',
    );
  });

  it('leaves an EMPTY field visible as its label, so the gap is obvious', () => {
    expect(assemblePrompt(block, { role: 'מנהל קהילה', task: '   ' })).toBe(
      'אתה מנהל קהילה.\nמשימה: [משימה].',
    );
  });
});

describe('do-now blocks', () => {
  it('rejects a line too long to read at a glance', () => {
    expect(why([{ kind: 'do-now', text: 'א'.repeat(141) }])).toMatch(/at a glance/);
  });

  it('accepts a line with a self-started timebox', () => {
    expect(ok([{ kind: 'do-now', text: 'כתבו פרומפט אחד', timeboxSeconds: 180 }])).toBe(true);
  });
});

describe('concept-card blocks', () => {
  it('REQUIRES all four comparison axes — a card missing one blurs the concepts again', () => {
    const full = {
      kind: 'concept-card',
      term: 'Skill',
      what: 'היכולת או השיטה',
      when: 'כשחוזרים על אותה משימה',
      example: 'ניסוח תקציר מנהלים לפי תבנית',
      notToBeConfusedWith: 'תוסף — שמוסיף פעולה, לא שיטה',
    };
    expect(ok([full])).toBe(true);
    for (const axis of ['what', 'when', 'example', 'notToBeConfusedWith']) {
      const { [axis]: _drop, ...partial } = full as Record<string, unknown>;
      expect(ok([partial])).toBe(false);
    }
  });
});
