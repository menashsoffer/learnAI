import { useMemo, useRef } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { loadDeck, buildSlugIndex, resolveSlug } from '@/engine';
import { getDeckRaw, DEFAULT_DECK_ID } from '@content/decks';
import { PresentationProvider } from '@/react/PresentationProvider';
import { useKeyboardNav } from '@/react/useKeyboardNav';
import { useHashSync } from '@/react/useHashSync';
import { useTimerTick } from '@/react/useTimerTick';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { Chrome } from '@/chrome/Chrome';
import { SceneStage } from '@/player/SceneStage';
import { validateDeckScenes } from '@/scenes/validateDeck';

export function PlayerRoute() {
  const { deckId = DEFAULT_DECK_ID, slug } = useParams();
  const raw = getDeckRaw(deckId);

  const deck = useMemo(() => (raw ? loadDeck(raw) : null), [raw]);

  // Start where the URL points (deep link / reload). Captured once; useHashSync then rules.
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
    <PresentationProvider key={deckId} deck={deck} startIndex={startIndexRef.current ?? 0}>
      <ThemeProvider locale={deck.meta.locale} dir={deck.meta.dir} brandKit={deck.meta.brandKitRef}>
        <Chrome />
        <main className="viewport">
          <SceneStage />
        </main>
        <NavBridge slug={slug} />
      </ThemeProvider>
    </PresentationProvider>
  );
}

/** Lives inside the provider so the nav hooks can reach the store. */
function NavBridge({ slug }: { slug: string | undefined }) {
  useKeyboardNav();
  useHashSync(slug);
  useTimerTick();
  return null;
}
