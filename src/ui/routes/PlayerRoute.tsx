import { useMemo, useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { loadDeck, buildSlugIndex, resolveSlug } from '@/engine';
import { getDeckRaw, DEFAULT_DECK_ID } from '@content/decks';
import { participantDeck } from '@/ui/participant/participantDeck';
import { PresentationProvider, type PlayerMode } from '@/react/PresentationProvider';
import { useKeyboardNav } from '@/react/useKeyboardNav';
import { useHashSync } from '@/react/useHashSync';
import { useTimerTick } from '@/react/useTimerTick';
import { useSessionTick } from '@/react/useSessionTick';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { Chrome } from '@/ui/chrome/Chrome';
import { SceneStage } from '@/ui/player/SceneStage';
import { GuidanceDrawer } from '@/ui/presenter/GuidanceDrawer';
import { PreFlight } from '@/ui/presenter/PreFlight';
import { validateDeckScenes } from '@/scenes/validateDeck';
import { storage } from '@/persistence/storage';
import { deckKey } from '@/persistence/namespace';

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
    return mode === 'study' ? participantDeck(full) : full;
  }, [raw, mode]);

  const startIndexRef = useRef<number | null>(null);
  if (deck && startIndexRef.current === null) {
    startIndexRef.current =
      resolveSlug(slug ?? '', buildSlugIndex(deck.scenes, deck.meta.redirects))?.index ?? 0;
  }

  /**
   * Present mode opens on the pre-flight screen, not on scene 1 — it is the only place the
   * session clock is started, and the drift reading is worthless if the clock did not start
   * when the talking did.
   *
   * Only at the FIRST scene, though: landing on a later one means a refresh or a shared
   * deep link mid-lecture, and the last thing that presenter needs is a setup screen.
   */
  const [preflightDone, setPreflightDone] = useState(
    () => mode !== 'present' || (startIndexRef.current ?? 0) > 0,
  );

  useMemo(() => {
    if (deck && import.meta.env.DEV) {
      const report = validateDeckScenes(deck);
      if (!report.ok) console.warn('[deck] scene validation issues:', report.issues);
    }
  }, [deck]);

  // Protect present mode if a presenter code is required
  const isPresenterAuthorized = useMemo(() => {
    if (!deck || mode !== 'present' || !deck.meta.presenterCode) return true;
    return storage.getString(deckKey(deck.meta.id, 'presenterOk')) === '1';
  }, [deck, mode]);

  if (!deck || !isPresenterAuthorized) {
    return <Navigate to={`/d/${deck?.meta.id ?? DEFAULT_DECK_ID}`} replace />;
  }

  return (
    <PresentationProvider
      key={`${deckId}:${mode}`}
      deck={deck}
      startIndex={startIndexRef.current ?? 0}
      mode={mode}
    >
      <ThemeProvider
        locale={deck.meta.locale}
        dir={deck.meta.dir}
        distance={mode === 'study' ? 'read' : 'project'}
      >
        {!preflightDone && <PreFlight onStart={() => setPreflightDone(true)} />}
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
  useSessionTick();
  return null;
}
