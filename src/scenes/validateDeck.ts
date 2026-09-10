import type { LoadedDeck, SceneRecord } from '@/engine';
import { resolveScene } from './registry';

export interface SceneValidationIssue {
  slug: string;
  type: string;
  path: string;
  message: string;
}

export interface DeckValidationReport {
  ok: boolean;
  issues: SceneValidationIssue[];
  /** slugs whose data failed — the player renders these degraded. */
  degraded: Set<string>;
  unknownTypes: string[];
}

/**
 * Validate every scene's `data` against its registered scene-type schema.
 * Used at app bootstrap (dev warning) and by scripts/validate-decks.ts (CI hard-fail).
 */
export function validateDeckScenes(deck: LoadedDeck): DeckValidationReport {
  const issues: SceneValidationIssue[] = [];
  const degraded = new Set<string>();
  const unknownTypes = new Set<string>();

  for (const scene of deck.scenes) {
    const mod = resolveScene(scene.type);
    if (mod.type === '__fallback__') {
      unknownTypes.add(scene.type);
      issues.push({
        slug: scene.slug,
        type: scene.type,
        path: 'type',
        message: `unknown scene type "${scene.type}"`,
      });
      degraded.add(scene.slug);
      continue;
    }
    const res = mod.schema.safeParse((scene as SceneRecord).data);
    if (!res.success) {
      degraded.add(scene.slug);
      for (const issue of res.error.issues) {
        issues.push({
          slug: scene.slug,
          type: scene.type,
          path: issue.path.join('.') || '(root)',
          message: issue.message,
        });
      }
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    degraded,
    unknownTypes: [...unknownTypes],
  };
}
