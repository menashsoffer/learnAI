import { describe, it, expect } from 'vitest';
import { initialNavState } from './machine';
import { canNext, canPrev, humanPosition, progress, mountedWindow } from './selectors';

describe('selectors', () => {
  it('canPrev/canNext at the edges', () => {
    const first = initialNavState(23, 0);
    const last = initialNavState(23, 22);
    expect(canPrev(first)).toBe(false);
    expect(canNext(first)).toBe(true);
    expect(canPrev(last)).toBe(true);
    expect(canNext(last)).toBe(false);
  });

  it('canNext true when phases remain even on the last scene', () => {
    expect(canNext({ ...initialNavState(23, 22), maxPhase: 2, phase: 0 })).toBe(true);
  });

  it('humanPosition is 1-based', () => {
    expect(humanPosition(initialNavState(23, 6))).toEqual({ current: 7, total: 23 });
  });

  it('progress spans 0..1', () => {
    expect(progress(initialNavState(23, 0))).toBe(0);
    expect(progress(initialNavState(23, 22))).toBe(1);
  });

  it('mountedWindow is active +/- 1, clamped', () => {
    expect(mountedWindow(initialNavState(23, 0))).toEqual([0, 1]);
    expect(mountedWindow(initialNavState(23, 10))).toEqual([9, 10, 11]);
    expect(mountedWindow(initialNavState(23, 22))).toEqual([21, 22]);
  });
});
