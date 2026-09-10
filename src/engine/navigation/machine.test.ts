import { describe, it, expect } from 'vitest';
import { navReducer, initialNavState, type NavState } from './machine';

const base = (over: Partial<NavState> = {}): NavState => ({ ...initialNavState(23, 0), ...over });

describe('navReducer', () => {
  it('next advances the scene', () => {
    expect(navReducer(base({ index: 2 }), { type: 'next' }).index).toBe(3);
  });

  it('next is a no-op at the last scene', () => {
    const last = base({ index: 22 });
    expect(navReducer(last, { type: 'next' })).toBe(last);
  });

  it('prev walks back, no-op at 0', () => {
    const first = base({ index: 0 });
    expect(navReducer(first, { type: 'prev' })).toBe(first);
    expect(navReducer(base({ index: 5 }), { type: 'prev' }).index).toBe(4);
  });

  it('goToIndex clamps to the deck bounds', () => {
    expect(navReducer(base(), { type: 'goToIndex', index: 999 }).index).toBe(22);
    expect(navReducer(base({ index: 5 }), { type: 'goToIndex', index: -5 }).index).toBe(0);
  });

  it('toggleOverlay flips grid <-> none', () => {
    const a = navReducer(base(), { type: 'toggleOverlay', overlay: 'grid' });
    expect(a.overlay).toBe('grid');
    const b = navReducer(a, { type: 'toggleOverlay', overlay: 'grid' });
    expect(b.overlay).toBe('none');
    const c = navReducer(a, { type: 'toggleOverlay', overlay: 'notes' });
    expect(c.overlay).toBe('notes');
  });

  it('timer lifecycle: setTarget -> toggle -> tick -> done', () => {
    let s = navReducer(base(), { type: 'timer/setTarget', target: 2 });
    expect(s.timer).toMatchObject({ status: 'idle', seconds: 2, target: 2 });
    s = navReducer(s, { type: 'timer/toggle' });
    expect(s.timer.status).toBe('running');
    s = navReducer(s, { type: 'timer/tick' });
    expect(s.timer.seconds).toBe(1);
    s = navReducer(s, { type: 'timer/tick' });
    expect(s.timer).toMatchObject({ seconds: 0, status: 'done' });
  });
});
