import { describe, it, expect } from 'vitest';
import {
  makeSession,
  startSession,
  pauseSession,
  toggleSession,
  tickSession,
  markStage,
  resetSession,
  formatElapsed,
} from './sessionClock';

describe('sessionClock', () => {
  it('does not advance until started', () => {
    expect(tickSession(makeSession()).elapsed).toBe(0);
  });

  it('advances both counters while running', () => {
    let s = startSession(makeSession());
    s = tickSession(tickSession(tickSession(s)));
    expect(s).toMatchObject({ elapsed: 3, stageElapsed: 3 });
  });

  it('freezes on pause and resumes from where it stopped', () => {
    let s = tickSession(tickSession(startSession(makeSession())));
    s = tickSession(pauseSession(s));
    expect(s.elapsed).toBe(2);
    s = tickSession(toggleSession(s));
    expect(s.elapsed).toBe(3);
  });

  it('markStage resets ONLY the per-stage counter — the session total must survive', () => {
    let s = startSession(makeSession());
    for (let i = 0; i < 90; i++) s = tickSession(s);
    s = markStage(s);
    expect(s).toMatchObject({ elapsed: 90, stageElapsed: 0 });
  });

  it('markStage is idempotent, so re-entering the same stage cannot wipe a reading', () => {
    const s = markStage(startSession(makeSession()));
    expect(markStage(s)).toBe(s);
  });

  it('resetSession clears everything', () => {
    expect(resetSession()).toEqual(makeSession());
  });

  it('formats past the hour, where MM:SS would silently wrap', () => {
    expect(formatElapsed(45)).toBe('0:45');
    expect(formatElapsed(90 * 60)).toBe('1:30:00');
    expect(formatElapsed(61 * 60 + 5)).toBe('1:01:05');
  });
});
