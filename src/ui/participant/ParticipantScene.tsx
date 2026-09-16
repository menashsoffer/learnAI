import type { SceneRecord } from '@/engine';
import type { Block } from '@/blocks/types';
import { BlocksRenderer } from '@/blocks/BlocksRenderer';
import { SceneView } from '@/ui/player/SceneView';
import { ActivityPanel } from './ActivityPanel';
import './participant.css';

/**
 * The participant's view of one scene. The participant deck is already filtered to scenes
 * flagged for study, so everything reaching here is intentional:
 *
 *   activity              -> the four-tier practice panel (ActivityPanel)
 *   student.blocks        -> reference material for a teaching scene
 *   otherwise             -> the scene's own component (openers, recall stops)
 *
 * Presenter notes and script are never shown here, in any branch.
 */
export function ParticipantScene({ scene }: { scene: SceneRecord }) {
  const student = scene.student;
  const title = student?.title ?? scene.title;

  if (scene.type === 'activity') {
    return (
      <div className="scene-shell student">
        <StudentHead title={title} subtitle={scene.subtitle} />
        <ActivityPanel scene={scene} />
      </div>
    );
  }

  if (student?.blocks?.length) {
    return (
      <div className="scene-shell student">
        <StudentHead title={title} subtitle={scene.subtitle} />
        <div className="student__panel">
          <span className="student__tag">
            {student.copyable === false ? 'מידע לעיון' : 'חומר לפעילות'}
          </span>
          <BlocksRenderer
            blocks={student.blocks as Block[]}
            copyable={student.copyable !== false}
          />
        </div>
      </div>
    );
  }

  return <SceneView scene={scene} />;
}

function StudentHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="scene-shell__head">
      <span className="line-motif" aria-hidden="true" />
      <h2 className="scene-shell__title">{title}</h2>
      {subtitle && <p className="scene-shell__subtitle">{subtitle}</p>}
    </header>
  );
}
