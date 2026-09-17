import { describe, it, expect } from 'vitest';
import { loadDeck } from '@/engine';
import raw from '@content/decks/ai-cadets-2026/deck.json';

/**
 * The phone and the projector walk the SAME stages. The participant view used to be a
 * filtered subset, so from the first stage without participant material on, the phone read
 * "08/12" while the projector read "09/13" — and a participant who looked up could not match
 * the two. Now there is no filter, which is only safe while every stage has something written
 * for the participant. This guards that.
 */
describe('participant / presenter parity', () => {
  const deck = loadDeck(raw);

  it('every stage has participant content, so the phone never shows a bare projector slide', () => {
    for (const scene of deck.scenes) {
      const has = scene.type === 'activity' || (scene.student?.blocks?.length ?? 0) > 0;
      expect(has, `stage "${scene.slug}" has nothing for participants`).toBe(true);
    }
  });
});
