import { useMemo } from 'react';
import {
  planFromDeck,
  pacingStatus,
  recoveryPlan,
  type PacingPlan,
  type PacingStatus,
} from '@/engine';
import { usePresentation, useDeck } from './PresentationProvider';

/** The authored plan. Constant for a given deck, so it is built once. */
export function usePacingPlan(): PacingPlan {
  const deck = useDeck();
  return useMemo(() => planFromDeck(deck), [deck]);
}

/**
 * Live pacing. Recomputed each session tick — the arithmetic is trivial and pure, which is
 * exactly why the model lives in `engine/pacing` and not in a component.
 */
export function usePacing(): PacingStatus & { recovery: ReturnType<typeof recoveryPlan> } {
  const plan = usePacingPlan();
  const index = usePresentation((s) => s.index);
  const elapsed = usePresentation((s) => s.session.elapsed);
  const stageElapsed = usePresentation((s) => s.session.stageElapsed);

  return useMemo(() => {
    const status = pacingStatus(plan, {
      index,
      sessionElapsedSec: elapsed,
      stageElapsedSec: stageElapsed,
    });
    return { ...status, recovery: recoveryPlan(status) };
  }, [plan, index, elapsed, stageElapsed]);
}
