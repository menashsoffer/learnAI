/** Public surface of the framework-light presentation engine. */

export type { SceneMeta, SceneRecord, DeckMeta, Deck, LoadedDeck, PrepItem } from './deck/types';
export { loadDeck } from './deck/loadDeck';
export { buildSlugIndex, resolveSlug } from './deck/slugIndex';
export type { SlugIndex, SlugResolution } from './deck/slugIndex';

export {
  navReducer,
  initialNavState,
  type NavState,
  type NavAction,
  type Overlay,
} from './navigation/machine';
export * as select from './navigation/selectors';

export {
  makeTimer,
  toggleTimer,
  resetTimer,
  adjustTimer,
  tickTimer,
  setTimerTarget,
  formatClock,
  type TimerModel,
  type TimerStatus,
} from './timing/timer';
export { systemClock, fixedClock, type Clock } from './timing/clock';

export {
  makeSession,
  startSession,
  pauseSession,
  toggleSession,
  tickSession,
  markStage,
  formatElapsed,
  type SessionClock,
  type SessionStatus,
} from './timing/sessionClock';

export {
  buildPlan,
  planWithout,
  planFromDeck,
  stageBudget,
  pacingStatus,
  recoveryPlan,
} from './pacing';
export type {
  StageBudget,
  PlannedStage,
  PacingPlan,
  PacingStatus,
  PacingState,
  PacingInput,
} from './pacing';

export { reconcile, type ReconcileResult, type ReconcileInput } from './deeplink/reconcile';
export { playerPath, presenterPath, parseLegacyHash } from './deeplink/hash';

export {
  createEngineStore,
  type EngineStore,
  type EngineState,
  type EngineStoreOptions,
} from './store/createEngineStore';
export { attachPersistence, readLastScene } from './store/persistMiddleware';
