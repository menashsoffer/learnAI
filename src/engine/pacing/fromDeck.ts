import type { LoadedDeck, SceneRecord } from '../deck/types';
import { buildPlan } from './plan';
import type { PacingPlan, StageBudget } from './types';

/** Fallback when a scene declares no budget — enough to keep the plan arithmetic sane. */
const DEFAULT_BUDGET_MIN = 1;

export function stageBudget(scene: SceneRecord): StageBudget {
  return {
    slug: scene.slug,
    title: scene.title,
    stage: scene.stage,
    budgetMin: scene.budgetMin ?? DEFAULT_BUDGET_MIN,
    optional: scene.optional ?? false,
    controlPoint: scene.controlPoint,
  };
}

/**
 * The plan for a loaded deck. Operates on `deck.scenes` as given, so the participant deck —
 * which is a real filtered subset — produces a correct plan for itself with no special case.
 */
export function planFromDeck(deck: LoadedDeck): PacingPlan {
  const stages = deck.scenes.map(stageBudget);
  const total = deck.meta.totalMinutes ?? stages.reduce((n, s) => n + s.budgetMin, 0);
  return buildPlan(stages, total);
}
