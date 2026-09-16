import { describe, it, expect } from 'vitest';
import { activitySchema } from './schema';

const valid = {
  doNow: 'קחו את התבנית ושנו משימה ופורמט.',
  timeboxSeconds: 480,
  steps: ['קחו את התבנית', 'שנו משימה ופורמט', 'הריצו ובקשו תיקון'],
  prompt: { mode: 'copy', label: 'הפרומפט המלא', text: 'אתה מנהל קשרי קהילה...' },
  successCriteria: ['לכל שלב יש אחראי'],
};

const err = (input: unknown) => {
  const r = activitySchema.safeParse(input);
  if (r.success) throw new Error('expected a validation failure');
  return r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(' | ');
};

describe('the four-tier activity contract', () => {
  it('accepts a complete screen', () => {
    expect(activitySchema.safeParse(valid).success).toBe(true);
  });

  /* Tier 0 — the imperative. */
  it('REJECTS a screen with no do-now line', () => {
    const { doNow: _drop, ...rest } = valid;
    expect(err(rest)).toContain('doNow');
  });

  it('rejects a do-now line too long to read at a glance on a phone', () => {
    expect(err({ ...valid, doNow: 'א'.repeat(141) })).toMatch(/at a glance/);
  });

  /* Tier 1 — everyone. */
  it('REJECTS a screen with no steps', () => {
    expect(err({ ...valid, steps: [] })).toContain('steps');
  });

  it('rejects more steps than an activity can hold', () => {
    expect(err({ ...valid, steps: ['a', 'b', 'c', 'd', 'e', 'f'] })).toMatch(/second activity/);
  });

  /* Tier 2 — the floor. This is the one that matters most. */
  it('REJECTS a screen with no floor — someone stuck would have nothing to copy', () => {
    const { prompt: _drop, ...rest } = valid;
    expect(err(rest)).toContain('prompt');
  });

  it('rejects a floor whose prompt text is empty', () => {
    expect(err({ ...valid, prompt: { mode: 'copy', label: 'x', text: '' } })).toContain('prompt');
  });

  it('accepts the builder as an alternative floor, where the template is being taught', () => {
    const r = activitySchema.safeParse({
      ...valid,
      prompt: {
        mode: 'build',
        builderId: 'first-prompt',
        fields: [
          { id: 'role', label: 'תפקיד' },
          { id: 'task', label: 'משימה' },
        ],
        template: 'אתה {role}.\nמשימה: {task}.',
      },
    });
    expect(r.success).toBe(true);
  });

  it('rejects a builder whose id is not a stable kebab-case key', () => {
    expect(
      err({
        ...valid,
        prompt: {
          mode: 'build',
          builderId: 'First Prompt',
          fields: [
            { id: 'role', label: 'תפקיד' },
            { id: 'task', label: 'משימה' },
          ],
          template: '{role} {task}',
        },
      }),
    ).toContain('builderId');
  });

  /* Tiers 3 and 4 are genuinely optional — a short activity may need neither. */
  it('accepts a screen with neither a safety net nor a ceiling', () => {
    const { successCriteria: _drop, ...rest } = valid;
    expect(activitySchema.safeParse(rest).success).toBe(true);
  });

  it('validates the safety net and ceiling as real blocks when present', () => {
    expect(err({ ...valid, extension: [{ kind: 'callout', title: 'סיימתם מוקדם?' }] })).toContain(
      'extension',
    );
  });
});
