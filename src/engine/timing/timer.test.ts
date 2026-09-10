import { describe, it, expect } from 'vitest';
import {
  makeTimer,
  startTimer,
  pauseTimer,
  resetTimer,
  adjustTimer,
  tickTimer,
  setTimerTarget,
  formatClock,
} from './timer';

describe('timer model', () => {
  it('makeTimer snaps seconds to target', () => {
    expect(makeTimer(90)).toEqual({ status: 'idle', seconds: 90, target: 90 });
  });

  it('will not start a zero timer', () => {
    expect(startTimer(makeTimer(0)).status).toBe('idle');
  });

  it('pause only affects a running timer', () => {
    expect(pauseTimer(makeTimer(10)).status).toBe('idle');
    expect(pauseTimer(startTimer(makeTimer(10))).status).toBe('paused');
  });

  it('tick decrements only while running and stops at done', () => {
    let t = startTimer(makeTimer(2));
    t = tickTimer(t);
    expect(t.seconds).toBe(1);
    t = tickTimer(t);
    expect(t).toMatchObject({ seconds: 0, status: 'done' });
    expect(tickTimer(t)).toBe(t);
  });

  it('adjust changes both target and remaining, never below 0', () => {
    const t = adjustTimer(makeTimer(60), 60);
    expect(t).toMatchObject({ target: 120, seconds: 120 });
    expect(adjustTimer(makeTimer(30), -100)).toMatchObject({ target: 0, seconds: 0 });
  });

  it('reset returns to idle at target', () => {
    const running = tickTimer(startTimer(makeTimer(10)));
    expect(resetTimer(running)).toEqual({ status: 'idle', seconds: 10, target: 10 });
  });

  it('setTimerTarget re-arms when the target changes', () => {
    const t = makeTimer(300);
    expect(setTimerTarget(t, 300)).toBe(t);
    expect(setTimerTarget(t, 600)).toEqual({ status: 'idle', seconds: 600, target: 600 });
  });

  it('formatClock is mm:ss', () => {
    expect(formatClock(0)).toBe('00:00');
    expect(formatClock(65)).toBe('01:05');
    expect(formatClock(600)).toBe('10:00');
  });
});
