import { useCallback, useMemo } from 'react';
import { usePresentationContext, usePresentation } from './PresentationProvider';
import { useOnline } from './env';
import type { SceneApi } from '@/scenes/contract';

/** Builds the SceneApi handed to every scene Component. Memoised on the slices it reads. */
export function useSceneApi(): SceneApi {
  const { store } = usePresentationContext();
  const timerModel = usePresentation((s) => s.timer);
  const online = useOnline();

  const setTarget = useCallback(
    (seconds: number) => store.getState().dispatch({ type: 'timer/setTarget', target: seconds }),
    [store],
  );
  const toggle = useCallback(() => store.getState().dispatch({ type: 'timer/toggle' }), [store]);
  const reset = useCallback(() => store.getState().dispatch({ type: 'timer/reset' }), [store]);

  return useMemo<SceneApi>(() => {
    return {
      online,
      timer: {
        model: timerModel,
        setTarget,
        toggle,
        reset,
      },
    };
  }, [online, timerModel, setTarget, toggle, reset]);
}
