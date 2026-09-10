import type { SceneModule } from './contract';
import { fallbackModule } from './_fallback/FallbackScene';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const registry = new Map<string, SceneModule<any>>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function registerScenes(mods: SceneModule<any>[]): void {
  for (const mod of mods) {
    if (registry.has(mod.type)) {
      throw new Error(`Scene type "${mod.type}" is already registered`);
    }
    registry.set(mod.type, mod);
  }
}

/** Never returns undefined — an unknown type resolves to the fallback module. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveScene(type: string): SceneModule<any> {
  return registry.get(type) ?? fallbackModule;
}
