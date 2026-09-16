/**
 * Pacing — the run sheet, executable.
 *
 * `documentation/RUN-SHEET.md` held a per-stage minute budget, a cumulative column and a set
 * of control points ("if you haven't finished the template by minute 40, cut the share-out").
 * It was markdown: the presenter had to carry all of it while standing in front of a room.
 * These types put the same information in the deck, where the UI can read it live.
 */

/** What the deck author budgets for one stage. */
export interface StageBudget {
  slug: string;
  title: string;
  /** Arc label — "פרומפט · בסיס". Shown to participants so they can re-anchor. */
  stage: string;
  budgetMin: number;
  /** A stage that may be dropped when running late, without breaking the arc. */
  optional: boolean;
  /** Presenter-facing instruction surfaced ON this stage, while it can still be acted on. */
  controlPoint?: string;
}

/** A stage placed on the timeline. */
export interface PlannedStage extends StageBudget {
  index: number;
  /** Minute at which this stage is planned to start. */
  startMin: number;
  /** Minute at which it is planned to end. */
  endMin: number;
}

export interface PacingPlan {
  /** The session length the deck claims (`meta.totalMinutes`). */
  totalMin: number;
  /** The sum of the stage budgets. May differ from `totalMin` — see `slackMin`. */
  plannedMin: number;
  /** `totalMin - plannedMin`. Negative means the deck is over-budget as authored. */
  slackMin: number;
  stages: PlannedStage[];
}

export type PacingState = 'ahead' | 'on-plan' | 'behind';

export interface PacingStatus {
  index: number;
  stage: PlannedStage | null;

  /** Signed minutes: POSITIVE = behind schedule, negative = ahead. */
  driftMin: number;
  state: PacingState;

  /** Seconds spent on the current stage, and its budget. */
  stageElapsedSec: number;
  stageBudgetSec: number;
  /** Negative once the stage is over budget. */
  stageRemainingSec: number;
  stageOver: boolean;

  /** Minute the session is projected to END at, if every remaining stage takes its budget. */
  projectedEndMin: number;
  /** `projectedEndMin - totalMin`. Positive = will overrun. */
  projectedOverrunMin: number;

  /** Minutes recoverable by dropping the optional stages still ahead. */
  recoverableMin: number;
  /** Those stages, nearest first — what the presenter would actually skip. */
  recoverable: PlannedStage[];

  controlPoint?: string;
}
