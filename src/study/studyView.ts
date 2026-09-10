import { buildSlugIndex, type LoadedDeck } from '@/engine';

/**
 * The participant deck is a filtered subset: only scenes carrying a `student` entry.
 * The presenter walks all scenes; participants get the activity / bookend scenes.
 * The engine then operates transparently on the smaller deck (counter, grid, deep links).
 *
 * Kept in its own module (not a helper inside PlayerRoute) so React Fast Refresh doesn't
 * leave it transiently undefined during a hot update.
 */
export function studyView(deck: LoadedDeck): LoadedDeck {
  const scenes = deck.scenes.filter((s) => s.student != null);
  const { slugToIndex, order } = buildSlugIndex(scenes, deck.meta.redirects);
  return { meta: deck.meta, scenes, slugToIndex, order };
}
