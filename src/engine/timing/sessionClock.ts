/**
 * The SESSION clock — counts UP from the moment the lecture starts, and separately tracks
 * how long the current stage has been on screen.
 *
 * Deliberately distinct from `timer.ts`, which counts DOWN for a participant activity. The
 * presenter reads both at once and must never confuse them: one answers "how long have I
 * been talking", the other "how long do they have left". Two models, two shapes, two names.
 */

export type SessionStatus = 'idle' | 'running' | 'paused' | 'ended';

export interface SessionClock {
  status: SessionStatus;
  /** Seconds since the session started (excluding paused time). */
  elapsed: number;
  /** Seconds since the current stage was entered. Reset by `markStage`. */
  stageElapsed: number;
}

export const makeSession = (): SessionClock => ({
  status: 'idle',
  elapsed: 0,
  stageElapsed: 0,
});

export const startSession = (s: SessionClock): SessionClock =>
  s.status === 'running' || s.status === 'ended' ? s : { ...s, status: 'running' };

export const pauseSession = (s: SessionClock): SessionClock =>
  s.status === 'running' ? { ...s, status: 'paused' } : s;

export const toggleSession = (s: SessionClock): SessionClock =>
  s.status === 'running' ? pauseSession(s) : startSession(s);

export const endSession = (s: SessionClock): SessionClock => ({ ...s, status: 'ended' });

export const resetSession = (): SessionClock => makeSession();

export const tickSession = (s: SessionClock): SessionClock =>
  s.status === 'running' ? { ...s, elapsed: s.elapsed + 1, stageElapsed: s.stageElapsed + 1 } : s;

/**
 * Entering a new stage. Only the per-stage counter resets — the session total never does,
 * which is what makes the drift reading trustworthy after a jump backwards to re-explain
 * something.
 */
export const markStage = (s: SessionClock): SessionClock =>
  s.stageElapsed === 0 ? s : { ...s, stageElapsed: 0 };

/** `H:MM` for the session readout — `formatClock`'s `MM:SS` is wrong past an hour. */
export const formatElapsed = (seconds: number): string => {
  const total = Math.max(0, Math.round(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
};
