import { createHashRouter, Navigate } from 'react-router-dom';
import { DEFAULT_DECK_ID } from '@content/decks';
import { PlayerRoute } from './PlayerRoute';
import { DeckIndexRedirect } from './DeckIndexRedirect';
import { NotFoundRoute } from './NotFoundRoute';

/**
 * One hash router for both build targets — `file://` has no server to resolve paths, so the
 * route IS the fragment. No clean-URL / SEO need (it's a PWA + an offline artifact).
 */
export const router = createHashRouter([
  { path: '/', element: <Navigate to={`/d/${DEFAULT_DECK_ID}`} replace /> },
  { path: '/d/:deckId', element: <DeckIndexRedirect /> },
  { path: '/d/:deckId/:slug', element: <PlayerRoute /> },
  { path: '/d/:deckId/presenter/:slug?', element: <PlayerRoute /> },
  { path: '*', element: <NotFoundRoute /> },
]);
