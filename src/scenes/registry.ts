import type { SceneModule } from './contract';
import { fallbackModule } from './_fallback/FallbackScene';

const registry = new Map<string, SceneModule<any>>(); // eslint-disable-line @typescript-eslint/no-explicit-any

export function registerScene(mod: SceneModule<any>): void {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  if (registry.has(mod.type)) {
    throw new Error(`Scene type "${mod.type}" is already registered`);
  }
  registry.set(mod.type, mod);
}

export function registerScenes(mods: SceneModule<any>[]): void {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  mods.forEach(registerScene);
}

/** Never returns undefined — an unknown type resolves to the fallback module. */
export function resolveScene(type: string): SceneModule<any> {
  // eslint-disable-line @typescript-eslint/no-explicit-any
  const mod = registry.get(type);
  if (!mod) return fallbackModule;
  if (mod.aliasOf) return registry.get(mod.aliasOf) ?? fallbackModule;
  return mod;
}

export function hasScene(type: string): boolean {
  return registry.has(type);
}

export function registeredTypes(): string[] {
  return [...registry.keys()];
}

/** Test / hot-reload helper. */
export function __resetRegistry(): void {
  registry.clear();
}
