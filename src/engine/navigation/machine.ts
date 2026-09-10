import {
  type TimerModel,
  makeTimer,
  toggleTimer,
  startTimer,
  pauseTimer,
  resetTimer,
  adjustTimer,
  setTimerTarget,
  tickTimer,
} from '../timing/timer';

export type Overlay = 'none' | 'grid' | 'notes';
export type SyncRole = 'local' | 'presenter' | 'main';

export interface NavState {
  /** Total scenes in the deck. */
  count: number;
  /** Active scene position. */
  index: number;
  /** Progressive-reveal step within the active scene (0..maxPhase). */
  phase: number;
  maxPhase: number;
  overlay: Overlay;
  timer: TimerModel;
  syncRole: SyncRole;
}

export type NavAction =
  | { type: 'goToIndex'; index: number; maxPhase?: number }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'setMaxPhase'; maxPhase: number }
  | { type: 'setPhase'; phase: number }
  | { type: 'setOverlay'; overlay: Overlay }
  | { type: 'toggleOverlay'; overlay: Exclude<Overlay, 'none'> }
  | { type: 'timer/setTarget'; target: number }
  | { type: 'timer/toggle' }
  | { type: 'timer/start' }
  | { type: 'timer/pause' }
  | { type: 'timer/reset' }
  | { type: 'timer/adjust'; delta: number }
  | { type: 'timer/tick' }
  | { type: 'sync/setRole'; role: SyncRole }
  | { type: 'sync/applyRemote'; index: number; phase: number };

export function initialNavState(count: number, index = 0): NavState {
  return {
    count: Math.max(1, count),
    index: clamp(index, 0, Math.max(0, count - 1)),
    phase: 0,
    maxPhase: 0,
    overlay: 'none',
    timer: makeTimer(0),
    syncRole: 'local',
  };
}

export function navReducer(state: NavState, action: NavAction): NavState {
  switch (action.type) {
    case 'goToIndex': {
      const index = clamp(action.index, 0, state.count - 1);
      if (index === state.index && state.phase === 0 && action.maxPhase === undefined) return state;
      return { ...state, index, phase: 0, maxPhase: action.maxPhase ?? state.maxPhase };
    }

    case 'next': {
      // Advance the in-scene reveal first, then the scene.
      if (state.phase < state.maxPhase) return { ...state, phase: state.phase + 1 };
      if (state.index >= state.count - 1) return state;
      return { ...state, index: state.index + 1, phase: 0, maxPhase: 0 };
    }

    case 'prev': {
      if (state.phase > 0) return { ...state, phase: state.phase - 1 };
      if (state.index <= 0) return state;
      return { ...state, index: state.index - 1, phase: 0, maxPhase: 0 };
    }

    case 'setMaxPhase':
      return { ...state, maxPhase: Math.max(0, action.maxPhase), phase: clamp(state.phase, 0, Math.max(0, action.maxPhase)) };

    case 'setPhase':
      return { ...state, phase: clamp(action.phase, 0, state.maxPhase) };

    case 'setOverlay':
      return state.overlay === action.overlay ? state : { ...state, overlay: action.overlay };

    case 'toggleOverlay':
      return { ...state, overlay: state.overlay === action.overlay ? 'none' : action.overlay };

    case 'timer/setTarget':
      return { ...state, timer: setTimerTarget(state.timer, action.target) };
    case 'timer/toggle':
      return { ...state, timer: toggleTimer(state.timer) };
    case 'timer/start':
      return { ...state, timer: startTimer(state.timer) };
    case 'timer/pause':
      return { ...state, timer: pauseTimer(state.timer) };
    case 'timer/reset':
      return { ...state, timer: resetTimer(state.timer) };
    case 'timer/adjust':
      return { ...state, timer: adjustTimer(state.timer, action.delta) };
    case 'timer/tick':
      return { ...state, timer: tickTimer(state.timer) };

    case 'sync/setRole':
      return { ...state, syncRole: action.role };
    case 'sync/applyRemote': {
      const index = clamp(action.index, 0, state.count - 1);
      return { ...state, index, phase: Math.max(0, action.phase) };
    }

    default: {
      // Exhaustiveness guard.
      const _never: never = action;
      return state ?? _never;
    }
  }
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}
