import { useMemo } from 'react';
import { usePresentationContext, usePresentation } from './PresentationProvider';
import { useReducedMotion, useOnline } from './env';
import { storage } from '@/persistence/storage';
import { deckKey } from '@/persistence/namespace';
import { defaultSink } from '@/analytics';
import { t, type MessageKey } from '@/i18n';
import type { SceneApi } from '@/scenes/contract';

/** Builds the SceneApi handed to every scene Component. Memoised on the slices it reads. */
export function useSceneApi(slug: string): SceneApi {
  const { store, deck } = usePresentationContext();
  const phase = usePresentation((s) => s.phase);
  const maxPhase = usePresentation((s) => s.maxPhase);
  const timerModel = usePresentation((s) => s.timer);
  const reducedMotion = useReducedMotion();
  const online = useOnline();

  return useMemo<SceneApi>(() => {
    const { dispatch } = store.getState();
    const ns = (key: string) => deckKey(deck.meta.id, `scene:${slug}:${key}`);
    return {
      next: () => dispatch({ type: 'next' }),
      prev: () => dispatch({ type: 'prev' }),
      goTo: (index) => dispatch({ type: 'goToIndex', index }),
      phase,
      maxPhase,
      setPhase: (n) => dispatch({ type: 'setPhase', phase: n }),
      persist: (key, value) => storage.setJSON(ns(key), value),
      getPersisted: <T,>(key: string, fallback: T) => storage.getJSON<T>(ns(key), fallback),
      track: (event, data) => defaultSink.track(event, data),
      t: (key: string, vars) => t(key as MessageKey, vars),
      mode: 'present',
      reducedMotion,
      online,
      timer: {
        model: timerModel,
        setTarget: (seconds: number) => dispatch({ type: 'timer/setTarget', target: seconds }),
        toggle: () => dispatch({ type: 'timer/toggle' }),
        reset: () => dispatch({ type: 'timer/reset' }),
        adjust: (delta: number) => dispatch({ type: 'timer/adjust', delta }),
      },
    };
  }, [store, deck.meta.id, slug, phase, maxPhase, timerModel, reducedMotion, online]);
}
