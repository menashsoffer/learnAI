import { describe, it, expect } from 'vitest';
import { navReducer, initialNavState, type NavState, type NavAction } from './machine';

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

describe('navigation and the session clock', () => {
  const run = (s: NavState, ...actions: NavAction[]) => actions.reduce(navReducer, s);
  const started = () => navReducer(initialNavState(5), { type: 'session/start' });

  it('resets the per-stage counter on every move, but never the session total', () => {
    let s = started();
    for (let i = 0; i < 120; i++) s = navReducer(s, { type: 'session/tick' });
    expect(s.session).toMatchObject({ elapsed: 120, stageElapsed: 120 });

    s = navReducer(s, { type: 'next' });
    expect(s.session).toMatchObject({ elapsed: 120, stageElapsed: 0 });
  });

  it('keeps the session total intact when jumping BACK to re-explain something', () => {
    let s = run(started(), { type: 'next' }, { type: 'next' });
    for (let i = 0; i < 60; i++) s = navReducer(s, { type: 'session/tick' });
    s = navReducer(s, { type: 'prev' });
    expect(s.session.elapsed).toBe(60);
    expect(s.session.stageElapsed).toBe(0);
    expect(s.index).toBe(1);
  });

  it('does not restart the stage counter when a move is a no-op at the deck edge', () => {
    let s = started();
    for (let i = 0; i < 30; i++) s = navReducer(s, { type: 'session/tick' });
    const atStart = navReducer(s, { type: 'prev' });
    expect(atStart).toBe(s);
    expect(atStart.session.stageElapsed).toBe(30);
  });

  it('records a skipped stage once, so the counter cannot drift on a double press', () => {
    const s = run(
      initialNavState(5),
      { type: 'skip', slug: 'recall' },
      { type: 'skip', slug: 'recall' },
    );
    expect(s.skipped).toEqual(['recall']);
  });
});
