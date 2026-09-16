import { useEffect } from 'react';
import { usePresentation, usePresentationContext } from './PresentationProvider';

/**
 * Drives the session clock. Separate interval from `useTimerTick` because the two clocks are
 * independent: the session keeps running while an activity countdown is paused, reset, or
 * has never been started at all.
 */
export function useSessionTick(): void {
  const { store } = usePresentationContext();
  const running = usePresentation((s) => s.session.status === 'running');

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => store.getState().dispatch({ type: 'session/tick' }), 1000);
    return () => clearInterval(id);
  }, [running, store]);
}
