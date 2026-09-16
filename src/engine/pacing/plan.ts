import type { StageBudget, PacingPlan, PlannedStage } from './types';

/**
 * Lay the stage budgets on a timeline. Pure arithmetic, no clock — this is the PLAN, and it
 * is identical every time the deck is opened. What actually happened is `status.ts`.
 */
export function buildPlan(stages: StageBudget[], totalMin: number): PacingPlan {
  let cursor = 0;
  const placed: PlannedStage[] = stages.map((s, index) => {
    const budgetMin = Math.max(0, s.budgetMin);
    const startMin = cursor;
    cursor += budgetMin;
    return { ...s, budgetMin, index, startMin, endMin: cursor };
  });

  const plannedMin = cursor;
  return {
    totalMin: Math.max(0, totalMin),
    plannedMin,
    slackMin: round1(Math.max(0, totalMin) - plannedMin),
    stages: placed,
  };
}

/**
 * The plan minus a set of dropped stages, re-laid on the timeline. Used to answer "what
 * happens if I skip this?" without mutating the authored plan.
 */
export function planWithout(plan: PacingPlan, droppedSlugs: readonly string[]): PacingPlan {
  const drop = new Set(droppedSlugs);
  const kept = plan.stages.filter((s) => !drop.has(s.slug));
  return buildPlan(kept, plan.totalMin);
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
