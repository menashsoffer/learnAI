import { Navigate, useParams } from 'react-router-dom';
import { loadDeck } from '@/engine';
import { getDeckRaw, DEFAULT_DECK_ID } from '@content/decks';

/** `/d/:deckId` -> `/d/:deckId/<first-slug>` (or last-visited once persistence hydration lands). */
export function DeckIndexRedirect() {
  const { deckId = DEFAULT_DECK_ID } = useParams();
  const raw = getDeckRaw(deckId);
  if (!raw) return <Navigate to={`/d/${DEFAULT_DECK_ID}`} replace />;
  const deck = loadDeck(raw);
  return <Navigate to={`/d/${deckId}/${deck.order[0]}`} replace />;
}
