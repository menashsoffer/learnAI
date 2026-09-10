/** Public surface of the framework-light presentation engine. */

export type { SceneMeta, SceneRecord, DeckMeta, Deck, LoadedDeck } from './deck/types';
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

export { reconcile, type ReconcileResult, type ReconcileInput } from './deeplink/reconcile';
export { playerPath, presenterPath, parseLegacyHash } from './deeplink/hash';

export {
  createEngineStore,
  type EngineStore,
  type EngineState,
  type EngineStoreOptions,
} from './store/createEngineStore';
export { attachPersistence, readLastScene } from './store/persistMiddleware';
