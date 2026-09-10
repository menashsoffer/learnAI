/**
 * Pure countdown model for the timed build steps (and any future timed activity).
 * Ticks are driven from outside (a setInterval in React, or `fixedClock` in tests).
 */

export type TimerStatus = 'idle' | 'running' | 'paused' | 'done';

export interface TimerModel {
  status: TimerStatus;
  /** Seconds remaining. */
  seconds: number;
  /** Seconds the timer resets to. */
  target: number;
}

export const makeTimer = (target: number): TimerModel => ({
  status: 'idle',
  seconds: Math.max(0, Math.round(target)),
  target: Math.max(0, Math.round(target)),
});

export const startTimer = (t: TimerModel): TimerModel =>
  t.status === 'done' || t.seconds <= 0 ? t : { ...t, status: 'running' };

export const pauseTimer = (t: TimerModel): TimerModel =>
  t.status === 'running' ? { ...t, status: 'paused' } : t;

export const toggleTimer = (t: TimerModel): TimerModel =>
  t.status === 'running' ? pauseTimer(t) : startTimer(t);

export const resetTimer = (t: TimerModel): TimerModel => ({
  status: 'idle',
  seconds: t.target,
  target: t.target,
});

export const adjustTimer = (t: TimerModel, deltaSeconds: number): TimerModel => {
  const target = Math.max(0, t.target + deltaSeconds);
  const seconds = Math.max(0, t.seconds + deltaSeconds);
  return {
    ...t,
    target,
    seconds,
    status: seconds === 0 && t.status === 'running' ? 'done' : t.status,
  };
};

/**
 * Change the reset target and snap to it (used when entering the scene). Idempotent when the
 * target is unchanged — re-arming with the same value must NOT wipe a running timer.
 */
export const setTimerTarget = (t: TimerModel, target: number): TimerModel =>
  t.target === Math.max(0, Math.round(target)) ? t : makeTimer(target);

export const tickTimer = (t: TimerModel): TimerModel => {
  if (t.status !== 'running') return t;
  const seconds = t.seconds - 1;
  return seconds <= 0 ? { ...t, seconds: 0, status: 'done' } : { ...t, seconds };
};

export const formatClock = (seconds: number): string => {
  const s = Math.max(0, Math.round(seconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
};
