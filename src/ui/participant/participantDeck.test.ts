import { describe, it, expect } from 'vitest';
import { loadDeck } from '@/engine';
import { participantDeck } from './participantDeck';
import raw from '@content/decks/ai-cadets-2026/deck.json';

/**
 * Regression guard for a bug that would have been discovered in front of a room: activities
 * carry their participant content in `data`, not in `student`, so a filter that looked only
 * at `student` dropped every single exercise from the participants' screens.
 */
describe('participantDeck', () => {
  const full = loadDeck(raw);
  const study = participantDeck(full);

  it('includes EVERY activity — the exercises are the whole point of study mode', () => {
    const activities = full.scenes.filter((s) => s.type === 'activity').map((s) => s.slug);
    expect(activities.length).toBeGreaterThan(0);
    for (const slug of activities) {
      expect(study.order, `activity "${slug}" is missing from the participant deck`).toContain(
        slug,
      );
    }
  });

  it('includes teaching scenes that authored student material', () => {
    const withStudent = full.scenes
      .filter((s) => s.type !== 'activity' && s.student != null)
      .map((s) => s.slug);
    for (const slug of withStudent) expect(study.order).toContain(slug);
  });

  it('drops scenes with nothing for a participant, rather than showing an empty screen', () => {
    const empty = full.scenes
      .filter((s) => s.type !== 'activity' && s.student == null)
      .map((s) => s.slug);
    for (const slug of empty) expect(study.order).not.toContain(slug);
  });

  it('stays a real subset with a correct index', () => {
    expect(study.scenes.length).toBe(study.order.length);
    expect(study.scenes.length).toBeLessThanOrEqual(full.scenes.length);
    study.order.forEach((slug, i) => expect(study.slugToIndex.get(slug)).toBe(i));
  });
});
