import { describe, it, expect } from 'vitest';
import { buildPlan, planWithout } from './plan';
import { pacingStatus, recoveryPlan } from './status';
import type { StageBudget } from './types';

const stage = (slug: string, budgetMin: number, extra: Partial<StageBudget> = {}): StageBudget => ({
  slug,
  title: slug,
  stage: slug,
  budgetMin,
  optional: false,
  ...extra,
});

/** A miniature of the real arc: 4 + 10 + 8 + 4 = 26 of a 30-minute session. */
const STAGES: StageBudget[] = [
  stage('opening', 4),
  stage('basics', 10, { controlPoint: 'אם עברת 14 — לקצר' }),
  stage('practice', 8, { optional: true }),
  stage('closing', 4),
];

describe('buildPlan', () => {
  it('lays stages end to end and reports slack against the session length', () => {
    const plan = buildPlan(STAGES, 30);
    expect(plan.plannedMin).toBe(26);
    expect(plan.slackMin).toBe(4);
    expect(plan.stages.map((s) => [s.startMin, s.endMin])).toEqual([
      [0, 4],
      [4, 14],
      [14, 22],
      [22, 26],
    ]);
  });

  it('reports NEGATIVE slack when the deck is authored over budget', () => {
    expect(buildPlan(STAGES, 20).slackMin).toBe(-6);
  });

  it('planWithout re-lays the timeline so later stages move earlier', () => {
    const plan = planWithout(buildPlan(STAGES, 30), ['practice']);
    expect(plan.plannedMin).toBe(18);
    expect(plan.stages.at(-1)).toMatchObject({ slug: 'closing', startMin: 14, endMin: 18 });
  });
});

describe('pacingStatus drift', () => {
  const plan = buildPlan(STAGES, 30);

  it('is on-plan when a stage starts when the plan says it should', () => {
    // Entered "basics" (planned start 4) at minute 4, 2 minutes in.
    const s = pacingStatus(plan, { index: 1, sessionElapsedSec: 6 * 60, stageElapsedSec: 2 * 60 });
    expect(s.driftMin).toBe(0);
    expect(s.state).toBe('on-plan');
  });

  it('is BEHIND, with a positive drift, when the stage started late', () => {
    // Entered "basics" at minute 7 instead of 4.
    const s = pacingStatus(plan, { index: 1, sessionElapsedSec: 8 * 60, stageElapsedSec: 60 });
    expect(s.driftMin).toBe(3);
    expect(s.state).toBe('behind');
  });

  it('is AHEAD, with a negative drift, when the stage started early', () => {
    const s = pacingStatus(plan, { index: 1, sessionElapsedSec: 2 * 60, stageElapsedSec: 0 });
    expect(s.driftMin).toBe(-2);
    expect(s.state).toBe('ahead');
  });

  it('does not drift while a stage legitimately runs — drift is measured at ENTRY', () => {
    const entry = pacingStatus(plan, { index: 1, sessionElapsedSec: 4 * 60, stageElapsedSec: 0 });
    const later = pacingStatus(plan, {
      index: 1,
      sessionElapsedSec: 12 * 60,
      stageElapsedSec: 8 * 60,
    });
    expect(later.driftMin).toBe(entry.driftMin);
    expect(later.state).toBe('on-plan');
  });

  it('flags the CURRENT stage as over budget independently of session drift', () => {
    // Started "basics" on time, but has been on it 12 minutes against a 10-minute budget.
    const s = pacingStatus(plan, {
      index: 1,
      sessionElapsedSec: 16 * 60,
      stageElapsedSec: 12 * 60,
    });
    expect(s.state).toBe('on-plan'); // entry was on time
    expect(s.stageOver).toBe(true); // but this stage has run long
    expect(s.stageRemainingSec).toBe(-2 * 60);
  });
});

describe('pacingStatus projection', () => {
  const plan = buildPlan(STAGES, 30);

  it('projects an on-time finish when everything is on plan', () => {
    const s = pacingStatus(plan, { index: 0, sessionElapsedSec: 0, stageElapsedSec: 0 });
    // 4 left on opening + 22 of later budget = 26.
    expect(s.projectedEndMin).toBe(26);
    expect(s.projectedOverrunMin).toBe(-4);
  });

  it('projects an overrun that carries the time already lost', () => {
    // 20 minutes gone, still on "basics" (12 of its 10 used), 12 minutes of budget left.
    const s = pacingStatus(plan, {
      index: 1,
      sessionElapsedSec: 20 * 60,
      stageElapsedSec: 12 * 60,
    });
    expect(s.projectedEndMin).toBe(32);
    expect(s.projectedOverrunMin).toBe(2);
  });

  it('surfaces the control point of the stage it belongs to, and no other', () => {
    expect(
      pacingStatus(plan, { index: 1, sessionElapsedSec: 0, stageElapsedSec: 0 }).controlPoint,
    ).toBe('אם עברת 14 — לקצר');
    expect(
      pacingStatus(plan, { index: 0, sessionElapsedSec: 0, stageElapsedSec: 0 }).controlPoint,
    ).toBeUndefined();
  });

  it('counts only the OPTIONAL stages still ahead as recoverable', () => {
    const early = pacingStatus(plan, { index: 0, sessionElapsedSec: 0, stageElapsedSec: 0 });
    expect(early.recoverableMin).toBe(8);
    // Once practice is behind us it can no longer be dropped.
    const late = pacingStatus(plan, { index: 3, sessionElapsedSec: 0, stageElapsedSec: 0 });
    expect(late.recoverableMin).toBe(0);
  });
});

describe('recoveryPlan', () => {
  const plan = buildPlan(STAGES, 30);

  it('suggests nothing while the session is projected to finish in time', () => {
    const s = pacingStatus(plan, { index: 0, sessionElapsedSec: 0, stageElapsedSec: 0 });
    expect(recoveryPlan(s)).toEqual({ drop: [], savedMin: 0, enough: true });
  });

  it('names the optional stage that absorbs the overrun', () => {
    const s = pacingStatus(plan, {
      index: 1,
      sessionElapsedSec: 20 * 60,
      stageElapsedSec: 12 * 60,
    });
    const r = recoveryPlan(s);
    expect(r.drop.map((d) => d.slug)).toEqual(['practice']);
    expect(r.enough).toBe(true);
  });

  it('admits when dropping everything optional is still not enough', () => {
    // Catastrophically behind: 50 minutes gone on a 30-minute session.
    const s = pacingStatus(plan, {
      index: 1,
      sessionElapsedSec: 50 * 60,
      stageElapsedSec: 40 * 60,
    });
    const r = recoveryPlan(s);
    expect(r.enough).toBe(false);
    expect(r.savedMin).toBe(8);
  });
});
