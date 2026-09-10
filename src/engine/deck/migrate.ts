import type { Deck, SceneRecord } from './types';

/**
 * Up-migrations for deck / scene-type schema drift. Keyed by scene `type`; each entry is an
 * ordered list of steps `from version N -> N+1`. No-op today (everything is v1) — the hook
 * exists so a later scene-type schema change doesn't break decks authored against the old one.
 */
type Step = (data: unknown) => unknown;

const SCENE_MIGRATIONS: Record<string, Step[]> = {
  // 'quiz': [ (v1) => v2Shape ],
};

export function migrateDeck(deck: Deck): Deck {
  return {
    ...deck,
    scenes: deck.scenes.map(migrateScene),
  };
}

function migrateScene(scene: SceneRecord): SceneRecord {
  const steps = SCENE_MIGRATIONS[scene.type];
  if (!steps || steps.length === 0) return scene;
  let version = scene.version ?? 1;
  let data = scene.data;
  while (version - 1 < steps.length) {
    data = steps[version - 1](data);
    version += 1;
  }
  return { ...scene, data, version };
}
