import type { ComponentType } from 'react';
import type { z } from 'zod';
import type { SceneMeta, TimerModel } from '@/engine';

/**
 * A scene type is a self-contained plugin module. Adding a type = add a folder + one line in
 * `src/scenes/index.ts`. The engine never imports this file's concrete modules — only the
 * React render layer and the registry do.
 */

export interface SceneApi {
  /** Whether the browser currently has a network connection. */
  online: boolean;
  /** Scoped access to the engine's single countdown model (timed activities). */
  timer: {
    model: TimerModel;
    setTarget(seconds: number): void;
    toggle(): void;
    reset(): void;
  };
}

export interface SceneProps<TData = unknown> {
  data: TData;
  scene: SceneMeta;
  api: SceneApi;
}

export interface SceneModule<TData = unknown> {
  type: string;
  schema: z.ZodType<TData>;
  Component: ComponentType<SceneProps<TData>>;
  defaultData: () => TData;
}

/** Helper for defining a module with inference on `TData`. */
export function defineScene<TData>(mod: SceneModule<TData>): SceneModule<TData> {
  return mod;
}
