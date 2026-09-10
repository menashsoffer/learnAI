/**
 * The ONE edit point when adding a scene type: import the module, add it to the array.
 * (The registry throws on duplicate types, so a copy-paste slip fails loudly.)
 */
import { registerScenes } from './registry';
import './scenes.css';

import hero from './hero';
import contentSkill from './content-skill';
import workshopInstructions from './workshop-instructions';

let registered = false;

export function registerBuiltInScenes(): void {
  if (registered) return;
  registerScenes([hero, contentSkill, workshopInstructions]);
  registered = true;
}

export { resolveScene } from './registry';
export type { SceneModule, SceneProps, SceneApi } from './contract';
