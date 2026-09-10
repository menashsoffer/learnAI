import type { ComponentType } from 'react';
import type { z } from 'zod';
import type { SceneMeta, TimerModel } from '@/engine';

/**
 * A scene type is a self-contained plugin module. Adding a type = add a folder + one line in
 * `src/scenes/index.ts`. The engine never imports this file's concrete modules — only the
 * React render layer and the registry do.
 */

export type SceneMode = 'present' | 'self-reading' | 'print' | 'thumbnail' | 'editor-preview';

export interface SceneApi {
  next(): void;
  prev(): void;
  goTo(index: number): void;
  /** Progressive-reveal step for this scene (0..maxPhase). */
  phase: number;
  maxPhase: number;
  setPhase(n: number): void;
  /** Namespaced to deck + scene slug; device-local. */
  persist(key: string, value: unknown): void;
  getPersisted<T>(key: string, fallback: T): T;
  track(event: string, data?: Record<string, unknown>): void;
  t(key: string, vars?: Record<string, string | number>): string;
  mode: SceneMode;
  reducedMotion: boolean;
  /** Whether the browser currently has a network connection. */
  online: boolean;
  /** Scoped access to the engine's single countdown model (workshop-timer, timed activities). */
  timer: {
    model: TimerModel;
    setTarget(seconds: number): void;
    toggle(): void;
    reset(): void;
    adjust(deltaSeconds: number): void;
  };
}

export interface SceneProps<TData = unknown> {
  data: TData;
  scene: SceneMeta;
  api: SceneApi;
}

export interface PresenterHints {
  cue?: string;
  estSeconds?: number;
  advanceOn?: 'click' | 'timer' | 'interaction';
  checklist?: string[];
}

export interface SceneCapabilities {
  interactive?: boolean;
  timer?: boolean;
  /** Renders links to the open web — chrome shows an "online required" notice. */
  external?: boolean;
  progressiveReveal?: boolean;
}

/** Minimal editor descriptor — consumed only by the (hosted-only) studio bundle. */
export type EditorField =
  | {
      path: string;
      label: string;
      control: 'text' | 'textarea' | 'number' | 'toggle' | 'select';
      options?: Array<{ value: string; label: string }>;
      help?: string;
    }
  | { path: string; label: string; control: 'blocks' }
  | { path: string; label: string; control: 'list'; item: EditorField[] };

export interface EditorDescriptor {
  fields?: EditorField[];
}

export interface SceneModule<TData = unknown> {
  type: string;
  version: number;
  schema: z.ZodType<TData>;
  Component: ComponentType<SceneProps<TData>>;
  defaultData: () => TData;
  deriveMaxPhase?: (data: TData) => number;
  presenterHints?: (data: TData, meta: SceneMeta) => PresenterHints;
  a11yLabel?: (data: TData, meta: SceneMeta) => string;
  capabilities?: SceneCapabilities;
  editor?: EditorDescriptor;
  /** e.g. `mini-game` -> `quiz` once the generalised engine lands (M4). */
  aliasOf?: string;
}

/** Helper for defining a module with inference on `TData`. */
export function defineScene<TData>(mod: SceneModule<TData>): SceneModule<TData> {
  return mod;
}
