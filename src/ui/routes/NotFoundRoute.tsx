import { Navigate } from 'react-router-dom';
import { loadDeck, buildSlugIndex, resolveSlug, parseLegacyHash } from '@/engine';
import { getDeckRaw, DEFAULT_DECK_ID } from '@content/decks';

/**
 * Catch-all. Resolves the legacy pre-platform hash form `#/<n>` to a canonical slug URL,
 * otherwise bounces to the default deck's first scene.
 */
export function NotFoundRoute() {
  const raw = getDeckRaw(DEFAULT_DECK_ID);
  if (!raw) return <Navigate to="/" replace />;

  const deck = loadDeck(raw);
  const idx = buildSlugIndex(deck.scenes, deck.meta.redirects);
  const first = deck.order[0];

  const { legacyIndex } = parseLegacyHash(window.location.hash);
  if (legacyIndex != null) {
    const hit = resolveSlug(String(legacyIndex), idx);
    if (hit) return <Navigate to={`/d/${DEFAULT_DECK_ID}/${hit.canonicalSlug}`} replace />;
  }

  return <Navigate to={`/d/${DEFAULT_DECK_ID}/${first}`} replace />;
}
