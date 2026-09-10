import { useMemo, useRef } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { loadDeck, buildSlugIndex, resolveSlug } from '@/engine';
import { getDeckRaw, DEFAULT_DECK_ID } from '@content/decks';
import { studyView } from '@/study/studyView';
import { PresentationProvider, type PlayerMode } from '@/react/PresentationProvider';
import { useKeyboardNav } from '@/react/useKeyboardNav';
import { useHashSync } from '@/react/useHashSync';
import { useTimerTick } from '@/react/useTimerTick';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { Chrome } from '@/chrome/Chrome';
import { SceneStage } from '@/player/SceneStage';
import { GuidanceDrawer } from '@/present/GuidanceDrawer';
import { validateDeckScenes } from '@/scenes/validateDeck';

/**
 * The deck shell, shared by all three entries:
 *   plain   — /d/:deckId/:slug            (neutral player, e.g. the offline artifact)
 *   present — /d/:deckId/present/:slug     (+ guidance drawer, "what to say", timer, next)
 *   study   — /d/:deckId/study/:slug       (participant activity companion)
 */
export function PlayerRoute({ mode = 'plain' }: { mode?: PlayerMode }) {
  const { deckId = DEFAULT_DECK_ID, slug } = useParams();
  const raw = getDeckRaw(deckId);

  const deck = useMemo(() => {
    if (!raw) return null;
    const full = loadDeck(raw);
    return mode === 'study' ? studyView(full) : full;
  }, [raw, mode]);

  const startIndexRef = useRef<number | null>(null);
  if (deck && startIndexRef.current === null) {
    startIndexRef.current =
      resolveSlug(slug ?? '', buildSlugIndex(deck.scenes, deck.meta.redirects))?.index ?? 0;
  }

  useMemo(() => {
    if (deck && import.meta.env.DEV) {
      const report = validateDeckScenes(deck);
      if (!report.ok) console.warn('[deck] scene validation issues:', report.issues);
    }
  }, [deck]);

  if (!deck) return <Navigate to={`/d/${DEFAULT_DECK_ID}`} replace />;

  return (
    <PresentationProvider
      key={`${deckId}:${mode}`}
      deck={deck}
      startIndex={startIndexRef.current ?? 0}
      mode={mode}
    >
      <ThemeProvider locale={deck.meta.locale} dir={deck.meta.dir} brandKit={deck.meta.brandKitRef}>
        <Chrome mode={mode} />
        <main className="viewport">
          <SceneStage mode={mode} />
        </main>
        {mode === 'present' && <GuidanceDrawer />}
        <NavBridge slug={slug} basePath={mode === 'plain' ? '' : mode} />
      </ThemeProvider>
    </PresentationProvider>
  );
}

function NavBridge({ slug, basePath }: { slug: string | undefined; basePath: string }) {
  useKeyboardNav();
  useHashSync(slug, undefined, basePath);
  useTimerTick();
  return null;
}
