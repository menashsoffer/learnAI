import type { SceneRecord } from '@/engine';
import type { Block } from '@/blocks/types';
import { BlocksRenderer } from '@/blocks/BlocksRenderer';
import { SceneView } from '@/player/SceneView';
import './study.css';

/**
 * The participant view of one scene. The participant deck is already filtered to the scenes
 * flagged for study (see studyView in PlayerRoute), so every scene reaching here is intentional:
 *   - `student.blocks` present  -> a lean activity panel (instructions, copyable prompts, links)
 *   - otherwise                 -> the scene's real component (hero, game, content, timer …)
 * Presenter notes / script / "what to say" are never shown here.
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

  return <SceneView scene={scene} />;
}
