import { z } from 'zod';
import { defineScene, type SceneProps } from '../contract';
import { SceneShell } from '../_shared/SceneShell';

/**
 * Rendered for an unknown scene `type` OR a known type whose `data` failed validation.
 * A bad authoring edit must never white-screen the deck — nav / deep-link / grid / print
 * all keep working around this.
 */
function FallbackScene({ scene, data }: SceneProps<unknown>) {
  return (
    <SceneShell scene={scene}>
      <p className="scene-fallback-note">
        הסצנה מסוג <code>{scene.type}</code> אינה זמינה בגרסה זו.
      </p>
      {import.meta.env.DEV && (
        <details className="scene-fallback-details">
          <summary>נתוני הסצנה (dev)</summary>
          <pre>{safeStringify(data)}</pre>
        </details>
      )}
    </SceneShell>
  );
}

function safeStringify(v: unknown): string {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

export const fallbackModule = defineScene<unknown>({
  type: '__fallback__',
  schema: z.unknown(),
  Component: FallbackScene,
  defaultData: () => ({}),
});
