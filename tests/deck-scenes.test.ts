import { describe, it, expect } from 'vitest';
import { loadDeck } from '@/engine';
import { registerBuiltInScenes } from '@/scenes';
import { validateDeckScenes } from '@/scenes/validateDeck';
import raw from '@content/decks/ai-cadets-2026/deck.json';

registerBuiltInScenes();

describe('ai-cadets-2026 deck', () => {
  const deck = loadDeck(raw);

  it('loads 11 scenes with unique slugs', () => {
    expect(deck.scenes).toHaveLength(11);
    expect(new Set(deck.order).size).toBe(11);
  });

  it('every scene validates against its scene-type schema', () => {
    const report = validateDeckScenes(deck);
    if (!report.ok) console.error(report.issues);
    expect(report.issues).toEqual([]);
    expect(report.unknownTypes).toEqual([]);
  });
});
