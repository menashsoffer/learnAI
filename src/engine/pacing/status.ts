import type { PacingPlan, PacingStatus, PacingState, PlannedStage } from './types';
import { round1 } from './plan';

export interface PacingInput {
  /** Position in the deck. */
  index: number;
  /** Seconds since the session started. */
  sessionElapsedSec: number;
  /** Seconds since the CURRENT stage was entered. */
  stageElapsedSec: number;
}

/** Minutes of drift within which the presenter is "on plan" and should be left alone. */
const ON_PLAN_TOLERANCE_MIN = 1;

/**
 * Where the session actually is against its plan.
 *
 * Drift is measured at stage ENTRY — "how late did I start this stage" — rather than against
 * the current instant. That is deliberate: it needs no history beyond the two clocks, and it
 * does not flicker between "behind" and "on plan" while a stage is legitimately running. The
 * separate `stageOver` flag covers overrunning the stage you are on right now.
 */
export function pacingStatus(plan: PacingPlan, input: PacingInput): PacingStatus {
  const stage = plan.stages[input.index] ?? null;
  const stageElapsedSec = Math.max(0, input.stageElapsedSec);
  const sessionElapsedSec = Math.max(0, input.sessionElapsedSec);

  // When this stage actually began, in minutes since session start.
  const entryMin = (sessionElapsedSec - stageElapsedSec) / 60;
  const driftMin = stage ? round1(entryMin - stage.startMin) : 0;

  const stageBudgetSec = stage ? stage.budgetMin * 60 : 0;
  const stageRemainingSec = stageBudgetSec - stageElapsedSec;

  // If every stage from here takes exactly its budget, when does the session end?
  const remainingBudgetMin = plan.stages
    .slice(input.index + 1)
    .reduce((sum, s) => sum + s.budgetMin, 0);
  const currentStageLeftMin = Math.max(0, stageRemainingSec) / 60;
  const projectedEndMin = round1(sessionElapsedSec / 60 + currentStageLeftMin + remainingBudgetMin);

  const recoverable = plan.stages.filter((s) => s.optional && s.index > input.index);

  return {
    index: input.index,
    stage,
    driftMin,
    state: classify(driftMin),
    stageElapsedSec,
    stageBudgetSec,
    stageRemainingSec,
    stageOver: stageBudgetSec > 0 && stageElapsedSec > stageBudgetSec,
    projectedEndMin,
    projectedOverrunMin: round1(projectedEndMin - plan.totalMin),
    recoverableMin: recoverable.reduce((sum, s) => sum + s.budgetMin, 0),
    recoverable,
    controlPoint: stage?.controlPoint,
  };
}

function classify(driftMin: number): PacingState {
  if (driftMin >= ON_PLAN_TOLERANCE_MIN) return 'behind';
  if (driftMin <= -ON_PLAN_TOLERANCE_MIN) return 'ahead';
  return 'on-plan';
}

/**
 * The smallest set of optional stages ahead that would absorb the projected overrun, nearest
 * first. Empty when nothing needs dropping — or when dropping everything optional still is
 * not enough, in which case the presenter needs to know that too (see `enough`).
 */
export function recoveryPlan(status: PacingStatus): {
  drop: PlannedStage[];
  savedMin: number;
  enough: boolean;
} {
  if (status.projectedOverrunMin <= 0) return { drop: [], savedMin: 0, enough: true };

  const drop: PlannedStage[] = [];
  let saved = 0;
  for (const s of status.recoverable) {
    if (saved >= status.projectedOverrunMin) break;
    drop.push(s);
    saved += s.budgetMin;
  }
  return { drop, savedMin: saved, enough: saved >= status.projectedOverrunMin };
}
