import { describe, it, expect } from 'vitest';
import { navReducer, initialNavState, type NavState } from './machine';

const base = (over: Partial<NavState> = {}): NavState => ({ ...initialNavState(23, 0), ...over });

describe('navReducer', () => {
  it('next advances the scene and resets phase/maxPhase', () => {
    const s = navReducer(base({ index: 2, phase: 0, maxPhase: 0 }), { type: 'next' });
    expect(s.index).toBe(3);
    expect(s.phase).toBe(0);
  });

  it('next steps the in-scene phase before the scene', () => {
    const s = navReducer(base({ index: 2, phase: 0, maxPhase: 2 }), { type: 'next' });
    expect(s.index).toBe(2);
    expect(s.phase).toBe(1);
    const s2 = navReducer({ ...s }, { type: 'next' });
    expect(s2.phase).toBe(2);
    const s3 = navReducer({ ...s2 }, { type: 'next' });
    expect(s3.index).toBe(3);
    expect(s3.phase).toBe(0);
  });

  it('next is a no-op at the last scene', () => {
    const last = base({ index: 22 });
    expect(navReducer(last, { type: 'next' })).toBe(last);
  });

  it('prev walks phase down then scene down, no-op at 0', () => {
    expect(navReducer(base({ index: 0 }), { type: 'prev' })).toEqual(base({ index: 0 }));
    const s = navReducer(base({ index: 5, phase: 1, maxPhase: 2 }), { type: 'prev' });
    expect(s).toMatchObject({ index: 5, phase: 0 });
    const s2 = navReducer(base({ index: 5, phase: 0 }), { type: 'prev' });
    expect(s2).toMatchObject({ index: 4, phase: 0 });
  });

  it('goToIndex clamps and resets phase', () => {
    expect(navReducer(base(), { type: 'goToIndex', index: 999 }).index).toBe(22);
    expect(navReducer(base(), { type: 'goToIndex', index: -5 }).index).toBe(0);
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

  it('sync/applyRemote sets index + phase and clamps', () => {
    const s = navReducer(base(), { type: 'sync/applyRemote', index: 100, phase: 3 });
    expect(s).toMatchObject({ index: 22, phase: 3 });
  });
});
