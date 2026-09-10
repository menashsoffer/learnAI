import { useEffect } from 'react';
import { usePresentation, usePresentationContext } from './PresentationProvider';

/**
 * Drives the engine's countdown: one interval, alive only while a timer is running.
 * App-level (not per-scene) so the timer keeps ticking if the presenter navigates away.
 */
export function useTimerTick(): void {
  const { store } = usePresentationContext();
  const running = usePresentation((s) => s.timer.status === 'running');

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => store.getState().dispatch({ type: 'timer/tick' }), 1000);
    return () => clearInterval(id);
  }, [running, store]);
}
