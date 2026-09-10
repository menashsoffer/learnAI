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

export interface NavState {
  /** Total scenes in the deck. */
  count: number;
  /** Active scene position. */
  index: number;
  overlay: Overlay;
  timer: TimerModel;
}

export type NavAction =
  | { type: 'goToIndex'; index: number }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'setOverlay'; overlay: Overlay }
  | { type: 'toggleOverlay'; overlay: Exclude<Overlay, 'none'> }
  | { type: 'timer/setTarget'; target: number }
  | { type: 'timer/toggle' }
  | { type: 'timer/start' }
  | { type: 'timer/pause' }
  | { type: 'timer/reset' }
  | { type: 'timer/adjust'; delta: number }
  | { type: 'timer/tick' };

export function initialNavState(count: number, index = 0): NavState {
  return {
    count: Math.max(1, count),
    index: clamp(index, 0, Math.max(0, count - 1)),
    overlay: 'none',
    timer: makeTimer(0),
  };
}

export function navReducer(state: NavState, action: NavAction): NavState {
  switch (action.type) {
    case 'goToIndex': {
      const index = clamp(action.index, 0, state.count - 1);
      return index === state.index ? state : { ...state, index };
    }

    case 'next':
      return state.index >= state.count - 1 ? state : { ...state, index: state.index + 1 };

    case 'prev':
      return state.index <= 0 ? state : { ...state, index: state.index - 1 };

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
