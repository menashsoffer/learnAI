import { describe, it, expect } from 'vitest';
import { initialNavState } from './machine';
import { canNext, canPrev, progress } from './selectors';

describe('selectors', () => {
  it('canPrev/canNext at the edges', () => {
    const first = initialNavState(23, 0);
    const last = initialNavState(23, 22);
    expect(canPrev(first)).toBe(false);
    expect(canNext(first)).toBe(true);
    expect(canPrev(last)).toBe(true);
    expect(canNext(last)).toBe(false);
  });

  it('progress spans 0..1', () => {
    expect(progress(initialNavState(23, 0))).toBe(0);
    expect(progress(initialNavState(23, 22))).toBe(1);
  });
});
