import { useMemo } from 'react';
import { usePresentationContext, usePresentation } from './PresentationProvider';
import { useOnline } from './env';
import type { SceneApi } from '@/scenes/contract';

/** Builds the SceneApi handed to every scene Component. Memoised on the slices it reads. */
export function useSceneApi(): SceneApi {
  const { store } = usePresentationContext();
  const timerModel = usePresentation((s) => s.timer);
  const online = useOnline();

  return useMemo<SceneApi>(() => {
    const { dispatch } = store.getState();
    return {
      online,
      timer: {
        model: timerModel,
        setTarget: (seconds: number) => dispatch({ type: 'timer/setTarget', target: seconds }),
        toggle: () => dispatch({ type: 'timer/toggle' }),
        reset: () => dispatch({ type: 'timer/reset' }),
      },
    };
  }, [store, timerModel, online]);
}
