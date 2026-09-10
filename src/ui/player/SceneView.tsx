import { useMemo } from 'react';
import type { SceneRecord } from '@/engine';
import { resolveScene } from '@/scenes';
import { fallbackModule } from '@/scenes/_fallback/FallbackScene';
import { SceneErrorBoundary } from '@/scenes/_shared/SceneShell';
import { useSceneApi } from '@/react/useSceneApi';
import { defaultSink } from '@/analytics';

/** Resolves the scene-type module, validates `data`, renders it (or a degraded shell). */
export function SceneView({ scene }: { scene: SceneRecord }) {
  const mod = resolveScene(scene.type);
  const api = useSceneApi();

  const parsed = useMemo(() => mod.schema.safeParse(scene.data), [mod, scene.data]);

  if (mod.type === '__fallback__' || !parsed.success) {
    if (import.meta.env.DEV && !parsed.success && mod.type !== '__fallback__') {
      console.warn(
        `[deck] scene "${scene.slug}" (${scene.type}) failed validation:`,
        parsed.error.issues,
      );
    }
    const Fallback = fallbackModule.Component;
    return <Fallback scene={scene} data={scene.data} api={api} />;
  }

  const Component = mod.Component;
  return (
    <SceneErrorBoundary scene={scene} onError={(e, d) => defaultSink.track(e, d)}>
      <Component scene={scene} data={parsed.data} api={api} />
    </SceneErrorBoundary>
  );
}
