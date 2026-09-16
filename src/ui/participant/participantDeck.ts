import { buildSlugIndex, type LoadedDeck, type SceneRecord } from '@/engine';

/**
 * Does this scene have anything to show a participant on their own device?
 *
 * TWO sources, and both matter:
 *   - an `activity` scene carries its participant content in `data` — the four tiers are
 *     required by its schema, so it ALWAYS has something to show;
 *   - any other scene shows a participant panel only if it authored `student` blocks.
 *
 * The check used to be `student != null` alone. When activities moved their participant
 * content into the tiers, that silently dropped every exercise from the participant deck —
 * the room would have been left with the reading scenes and none of the practice. Hence the
 * test beside this file.
 */
function hasParticipantContent(scene: SceneRecord): boolean {
  if (scene.type === 'activity') return true;
  return scene.student != null;
}

/**
 * The participant deck is a real filtered subset: the presenter walks all the stages, the
 * participants get the ones with something for them to do or read. The engine then operates
 * transparently on the smaller deck — counter, grid and deep links all stay correct.
 *
 * Kept in its own module (not a helper inside PlayerRoute) so React Fast Refresh doesn't
 * leave it transiently undefined during a hot update.
 */
export function participantDeck(deck: LoadedDeck): LoadedDeck {
  const scenes = deck.scenes.filter(hasParticipantContent);
  const { slugToIndex, order } = buildSlugIndex(scenes, deck.meta.redirects);
  return { meta: deck.meta, scenes, slugToIndex, order };
}
