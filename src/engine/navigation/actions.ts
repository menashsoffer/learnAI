import type { NavAction, Overlay, SyncRole } from './machine';

/** Thin action creators — handy for React callbacks and tests. */
export const nav = {
  goToIndex: (index: number, maxPhase?: number): NavAction => ({ type: 'goToIndex', index, maxPhase }),
  next: (): NavAction => ({ type: 'next' }),
  prev: (): NavAction => ({ type: 'prev' }),
  setMaxPhase: (maxPhase: number): NavAction => ({ type: 'setMaxPhase', maxPhase }),
  setPhase: (phase: number): NavAction => ({ type: 'setPhase', phase }),
  setOverlay: (overlay: Overlay): NavAction => ({ type: 'setOverlay', overlay }),
  toggleOverlay: (overlay: Exclude<Overlay, 'none'>): NavAction => ({ type: 'toggleOverlay', overlay }),
  timerSetTarget: (target: number): NavAction => ({ type: 'timer/setTarget', target }),
  timerToggle: (): NavAction => ({ type: 'timer/toggle' }),
  timerReset: (): NavAction => ({ type: 'timer/reset' }),
  timerAdjust: (delta: number): NavAction => ({ type: 'timer/adjust', delta }),
  timerTick: (): NavAction => ({ type: 'timer/tick' }),
  setSyncRole: (role: SyncRole): NavAction => ({ type: 'sync/setRole', role }),
  applyRemote: (index: number, phase: number): NavAction => ({ type: 'sync/applyRemote', index, phase }),
} as const;
