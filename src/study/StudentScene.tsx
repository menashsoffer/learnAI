import type { SceneRecord } from '@/engine';
import type { Block } from '@/blocks/types';
import { BlocksRenderer } from '@/blocks/BlocksRenderer';
import { SceneView } from '@/player/SceneView';
import './study.css';

/** Scene types participants operate directly (play / type / watch the timer). */
const INTERACTIVE = new Set([
  'mini-game',
  'warmup-input',
  'workshop-timer',
  'workshop-instructions',
]);

/**
 * The participant view. It never shows the presenter's notes / script / background —
 * only activity material: operating instructions, copyable prompts, links, and a short
 * takeaway for the scenes the presenter simply talks through.
 */
export function StudentScene({ scene }: { scene: SceneRecord }) {
  const student = scene.student;

  if (student?.blocks?.length) {
    return (
      <div className="scene-shell student student--activity">
        <header className="scene-shell__head">
          <span className="line-motif" aria-hidden="true" />
          <h2 className="scene-shell__title">{student.title ?? scene.title}</h2>
          {scene.subtitle && <p className="scene-shell__subtitle">{scene.subtitle}</p>}
        </header>
        <div className="student__panel">
          <span className="student__tag">חומר לפעילות</span>
          <BlocksRenderer blocks={student.blocks as Block[]} copyable />
        </div>
      </div>
    );
  }

  if (INTERACTIVE.has(scene.type)) {
    return <SceneView scene={scene} />;
  }

  // Background / explanation scene — the presenter is talking; keep it calm and short.
  return (
    <div className="scene-shell align-center student student--wait">
      <span className="line-motif" aria-hidden="true" />
      <h2 className="scene-shell__title">{scene.title}</h2>
      <p className="student__wait-hint">המנחה מסביר — נתקדם יחד 🙂</p>
      {scene.selfReading && <p className="student__takeaway">{scene.selfReading}</p>}
    </div>
  );
}
