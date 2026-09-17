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
import {
  type SessionClock,
  makeSession,
  startSession,
  pauseSession,
  toggleSession,
  endSession,
  resetSession,
  tickSession,
  markStage,
} from '../timing/sessionClock';

export type Overlay = 'none' | 'grid';

export interface NavState {
  /** Total scenes in the deck. */
  count: number;
  /** Active scene position. */
  index: number;
  overlay: Overlay;
  /** Counts DOWN for a participant activity. */
  timer: TimerModel;
  /** Counts UP for the whole lecture. Two clocks, never interchangeable. */
  session: SessionClock;
  /** Stages the presenter chose to skip. Kept so the counter stays honest. */
  skipped: readonly string[];
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
  | { type: 'timer/tick' }
  | { type: 'session/start' }
  | { type: 'session/toggle' }
  | { type: 'session/pause' }
  | { type: 'session/end' }
  | { type: 'session/reset' }
  | { type: 'session/tick' }
  | { type: 'skip'; slug: string };

export function initialNavState(count: number, index = 0): NavState {
  return {
    count: Math.max(1, count),
    index: clamp(index, 0, Math.max(0, count - 1)),
    overlay: 'none',
    timer: makeTimer(0),
    session: makeSession(),
    skipped: [],
  };
}

export function navReducer(state: NavState, action: NavAction): NavState {
  switch (action.type) {
    case 'goToIndex': {
      const index = clamp(action.index, 0, state.count - 1);
      return index === state.index ? state : enterStage(state, index);
    }

    case 'next':
      return state.index >= state.count - 1 ? state : enterStage(state, state.index + 1);

    case 'prev':
      return state.index <= 0 ? state : enterStage(state, state.index - 1);

    case 'setOverlay':
      return state.overlay === action.overlay ? state : { ...state, overlay: action.overlay };

    case 'toggleOverlay':
      return { ...state, overlay: state.overlay === action.overlay ? 'none' : action.overlay };

    case 'timer/setTarget':
      return withTimer(state, setTimerTarget(state.timer, action.target));
    case 'timer/toggle':
      return withTimer(state, toggleTimer(state.timer));
    case 'timer/start':
      return withTimer(state, startTimer(state.timer));
    case 'timer/pause':
      return withTimer(state, pauseTimer(state.timer));
    case 'timer/reset':
      return withTimer(state, resetTimer(state.timer));
    case 'timer/adjust':
      return withTimer(state, adjustTimer(state.timer, action.delta));
    case 'timer/tick':
      return withTimer(state, tickTimer(state.timer));

    case 'session/start':
      return { ...state, session: startSession(state.session) };
    case 'session/toggle':
      return { ...state, session: toggleSession(state.session) };
    case 'session/pause':
      return { ...state, session: pauseSession(state.session) };
    case 'session/end':
      return { ...state, session: endSession(state.session) };
    case 'session/reset':
      return { ...state, session: resetSession() };
    case 'session/tick':
      return { ...state, session: tickSession(state.session) };

    case 'skip':
      return state.skipped.includes(action.slug)
        ? state
        : { ...state, skipped: [...state.skipped, action.slug] };

    default: {
      // Exhaustiveness guard.
      const _never: never = action;
      return state ?? _never;
    }
  }
}

/**
 * Moving to a new stage restarts the per-stage counter but never the session total — that
 * separation is what keeps the drift reading honest after jumping back to re-explain something.
 */
function enterStage(state: NavState, index: number): NavState {
  return { ...state, index, session: markStage(state.session) };
}

/** Keep the state reference when the timer didn't change, so a no-op dispatch doesn't re-render. */
function withTimer(state: NavState, timer: NavState['timer']): NavState {
  return timer === state.timer ? state : { ...state, timer };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}
