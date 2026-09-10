/**
 * The ONE edit point when adding a scene type: import the module, add it to the array.
 * (The registry throws on duplicate types, so a copy-paste slip fails loudly.)
 */
import { registerScenes } from './registry';
import './scenes.css';

import hero from './hero';
import sectionCover from './section-cover';
import warmupInput from './warmup-input';
import clickRevealCards from './click-reveal-cards';
import archivistAnimation from './archivist-animation';
import twoColumn from './two-column';
import layeredDiagram from './layered-diagram';
import contentSkill from './content-skill';
import workshopInstructions from './workshop-instructions';
import workshopTimer from './workshop-timer';
import miniGame from './mini-game';

let registered = false;

export function registerBuiltInScenes(): void {
  if (registered) return;
  registerScenes([
    hero,
    sectionCover,
    warmupInput,
    clickRevealCards,
    archivistAnimation,
    twoColumn,
    layeredDiagram,
    contentSkill,
    workshopInstructions,
    workshopTimer,
    miniGame,
  ]);
  registered = true;
}

export { resolveScene, hasScene, registeredTypes } from './registry';
export type { SceneModule, SceneProps, SceneApi } from './contract';
