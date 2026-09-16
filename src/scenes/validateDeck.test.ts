import { describe, it, expect } from 'vitest';
import { loadDeck, planFromDeck, buildSlugIndex, resolveSlug } from '@/engine';
import { registerBuiltInScenes } from './index';
import { validateDeckScenes } from './validateDeck';
import { activitySchema } from './activity/schema';
import raw from '@content/decks/ai-cadets-2026/deck.json';
import released from '../../scripts/released-slugs.json';

registerBuiltInScenes();

/**
 * The real deck, checked against the promises the product makes about it. A scene count is
 * not one of those promises — it changes whenever the arc is re-cut — so these assert the
 * invariants instead: the clock adds up, every practice screen has a floor, every teaching
 * screen says why it matters, and no published link 404s.
 */
describe('ai-cadets-2026 deck', () => {
  const deck = loadDeck(raw);

  it('has unique slugs', () => {
    expect(new Set(deck.order).size).toBe(deck.scenes.length);
  });

  it('every scene validates against its scene-type schema', () => {
    const report = validateDeckScenes(deck);
    if (!report.ok) console.error(report.issues);
    expect(report.issues).toEqual([]);
    expect(report.unknownTypes).toEqual([]);
  });

  it('the stage budgets fit the session — the run sheet must not lie', () => {
    const plan = planFromDeck(deck);
    expect(plan.totalMin).toBe(90);
    expect(plan.plannedMin).toBeLessThanOrEqual(plan.totalMin);
    expect(plan.slackMin).toBeGreaterThanOrEqual(0);
  });

  it('every stage declares a budget, or the pacing silently invents one', () => {
    const missing = deck.scenes.filter((s) => s.budgetMin == null).map((s) => s.slug);
    expect(missing).toEqual([]);
  });

  it('EVERY activity has a floor someone stuck can use unedited', () => {
    const activities = deck.scenes.filter((s) => s.type === 'activity');
    expect(activities.length).toBeGreaterThan(0);
    for (const scene of activities) {
      const parsed = activitySchema.safeParse(scene.data);
      expect(parsed.success, `${scene.slug} failed the activity contract`).toBe(true);
      if (parsed.success) {
        const { prompt } = parsed.data;
        const usable = prompt.mode === 'copy' ? prompt.text.length > 40 : prompt.fields.length >= 3;
        expect(usable, `${scene.slug} has no usable floor`).toBe(true);
      }
    }
  });

  it('every teaching scene says why it matters in public-sector work', () => {
    const concepts = deck.scenes.filter((s) => s.type === 'concept');
    for (const scene of concepts) {
      const why = (scene.data as { whyPublic?: string }).whyPublic;
      expect(why, `${scene.slug} has no whyPublic`).toBeTruthy();
    }
  });

  it('every RELEASED slug still resolves — a link shared after a lecture must not 404', () => {
    const index = buildSlugIndex(deck.scenes, deck.meta.redirects);
    for (const slug of released['ai-cadets-2026']) {
      expect(resolveSlug(slug, index), `released slug "${slug}" no longer resolves`).toBeTruthy();
    }
  });

  it('the presenter has something to say on every stage', () => {
    const silent = deck.scenes.filter((s) => !s.presenterScript && !s.notes).map((s) => s.slug);
    expect(silent).toEqual([]);
  });
});
