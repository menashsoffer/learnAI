/**
 * The ONE edit point when adding a scene type: import the module, add it to the array.
 * (The registry throws on duplicate types, so a copy-paste slip fails loudly.)
 */
import { registerScenes } from './registry';
import './scenes.css';

import hero from './hero';
import concept from './concept';
import activity from './activity';
import promptBoard from './prompt-board';
import compare from './compare';

let registered = false;

export function registerBuiltInScenes(): void {
  if (registered) return;
  registerScenes([hero, concept, activity, promptBoard, compare]);
  registered = true;
}

export { resolveScene } from './registry';
export type { SceneModule, SceneProps, SceneApi } from './contract';
