import { usePresentation, useEngineDispatch, useDeck } from '@/react/PresentationProvider';
import { select } from '@/engine';
import type { SceneRecord } from '@/engine';
import type { Block } from '@/blocks/types';
import { Icon } from '@/assets/icons/Icon';

/**
 * Thumb-reachable navigation, pinned to the bottom on a phone. Participants move themselves
 * (there is no sync), so moving must be the easiest thing on the screen — not a pair of
 * small chevrons in a corner.
 *
 * "לפרומפט" jumps to the floor: mid-exercise, the thing someone needs is almost always the
 * copyable prompt, and hunting for it by scrolling is how people fall behind.
 */
export function StudentNav() {
  const dispatch = useEngineDispatch();
  const deck = useDeck();
  const index = usePresentation((s) => s.index);
  const canPrev = usePresentation(select.canPrev);
  const canNext = usePresentation(select.canNext);
  const hasPrompt = sceneHasPrompt(deck.scenes[index]);

  const toPrompt = () => {
    const el = document.querySelector('.slide--active :is(.blk-prompt, .blk-builder)');
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <nav className={`studentnav${hasPrompt ? '' : ' studentnav--two'}`} aria-label="ניווט">
      <button
        type="button"
        className="studentnav__btn"
        onClick={() => dispatch({ type: 'prev' })}
        disabled={!canPrev}
      >
        <Icon name="prev" size={20} />
        הקודם
      </button>
      {hasPrompt && (
        <button type="button" className="studentnav__btn studentnav__btn--jump" onClick={toPrompt}>
          <Icon name="jump" size={20} />
          לפרומפט
        </button>
      )}
      <button
        type="button"
        className="studentnav__btn studentnav__btn--next"
        onClick={() => dispatch({ type: 'next' })}
        disabled={!canNext}
      >
        הבא
        <Icon name="next" size={20} />
      </button>
    </nav>
  );
}

/**
 * Whether this scene has anything for "לפרומפט" to jump to. An activity scene always has a
 * prompt (the schema requires it); a teaching scene only sometimes does, via an
 * `example-prompt` or `prompt-builder` block — possibly nested inside `columns`. Without this
 * check the button sat there on prompt-less scenes (opening, foundations, recall, concepts,
 * closing) doing nothing when tapped, with no sign why.
 */
function sceneHasPrompt(scene: SceneRecord | undefined): boolean {
  if (!scene) return false;
  if (scene.type === 'activity') return true;
  return blocksHavePrompt((scene.student?.blocks as Block[] | undefined) ?? []);
}

function blocksHavePrompt(blocks: Block[]): boolean {
  return blocks.some((b) => {
    if (b.kind === 'example-prompt' || b.kind === 'prompt-builder') return true;
    if (b.kind === 'columns') return b.columns.some((col) => blocksHavePrompt(col.blocks));
    return false;
  });
}
