import type { CSSProperties } from 'react';
import type { SceneMeta } from '@/engine';

/**
 * THE PART CLIMATES.
 *
 * Every part of the session (פתיחה, פרומפטינג, בנייה…) lives in its own soft colour climate,
 * and every stage inside that part shares it. The room knows which part it is in by the
 * colour of the ground, before it reads a word.
 *
 * Climates come off a fixed wheel in the order parts first appear, so a deck never has to
 * name a colour — adding a part just takes the next one.
 */

export const HUES = [
  'yellow',
  'orange',
  'grass',
  'teal',
  'ultramarine',
  'violet',
  'sienna',
] as const;
export type Hue = (typeof HUES)[number];

/** The part a stage belongs to. Authored `part` wins; otherwise the stage label's first word. */
export function partOf(scene: Pick<SceneMeta, 'part' | 'stage'>): string {
  if (scene.part) return scene.part;
  return scene.stage.split(/[·#]/)[0]?.trim() || scene.stage;
}

/** The stage label, unless it only repeats its part's name (פתיחה · פתיחה). */
export function stageDetail(scene: Pick<SceneMeta, 'stage'>, partName: string): string | undefined {
  return scene.stage && scene.stage !== partName ? scene.stage : undefined;
}

export interface Part {
  name: string;
  hue: Hue;
  /** Index of this part's first stage in the scene list. */
  first: number;
  /** Stage indices belonging to this part, in order. */
  indices: number[];
  minutes: number;
}

export interface SectionMap {
  parts: Part[];
  /** Part index for each scene index. */
  partIndex: number[];
}

export function buildSections(
  scenes: Pick<SceneMeta, 'part' | 'stage' | 'budgetMin'>[],
): SectionMap {
  const parts: Part[] = [];
  const byName = new Map<string, number>();
  const partIndex = scenes.map((scene, i) => {
    const name = partOf(scene);
    let p = byName.get(name);
    if (p === undefined) {
      p = parts.length;
      byName.set(name, p);
      parts.push({ name, hue: HUES[p % HUES.length]!, first: i, indices: [], minutes: 0 });
    }
    parts[p]!.indices.push(i);
    parts[p]!.minutes += scene.budgetMin ?? 0;
    return p;
  });
  return { parts, partIndex };
}

/** Custom properties that put a subtree in one part's climate (see tokens/semantic.css). */
export function hueStyle(hue: Hue): CSSProperties {
  return {
    '--sec': `var(--hue-${hue})`,
    '--on-sec': `var(--hue-${hue}-on)`,
    '--sec-tint': `var(--hue-${hue}-tint)`,
    '--sec-accent': `var(--hue-${hue}-accent)`,
    '--sec-deep': `var(--hue-${hue}-deep)`,
  } as CSSProperties;
}
