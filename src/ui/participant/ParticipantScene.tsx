import type { SceneRecord } from '@/engine';
import type { Block } from '@/blocks/types';
import { BlocksRenderer } from '@/blocks/BlocksRenderer';
import { SceneView } from '@/ui/player/SceneView';
import { ActivityPanel } from './ActivityPanel';
import './participant.css';

/**
 * The participant's view of one scene. Participants walk the same stages as the projector
 * (so the counters agree), and every stage in the deck authors something for them:
 *
 *   activity              -> the four-tier practice panel (ActivityPanel)
 *   student.blocks        -> reference material for a teaching scene
 *   otherwise             -> the scene's own component — a fallback, not the plan
 */
export function ParticipantScene({ scene, active }: { scene: SceneRecord; active?: boolean }) {
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

  return <SceneView scene={scene} active={active} />;
}

function StudentHead({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="scene-shell__head">
      <h2 className="scene-shell__title">{title}</h2>
      {subtitle && <p className="scene-shell__subtitle">{subtitle}</p>}
    </header>
  );
}
