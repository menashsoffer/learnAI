import { createHashRouter } from 'react-router-dom';
import { LandingRoute } from './LandingRoute';
import { PlayerRoute } from './PlayerRoute';
import { NotFoundRoute } from './NotFoundRoute';

/**
 * One hash router for both build targets — `file://` has no server to resolve paths, so the
 * route IS the fragment. No clean-URL / SEO need (it's a PWA + an offline artifact).
 *
 *   /d/:deckId                    landing — two doors
 *   /d/:deckId/present/:slug      presenter view (guidance drawer, script, timer)
 *   /d/:deckId/study/:slug        participant activity companion
 *   /d/:deckId/:slug              neutral player (offline artifact / shared deep links)
 */
export const router = createHashRouter([
  { path: '/', element: <LandingRoute /> },
  { path: '/d/:deckId', element: <LandingRoute /> },
  { path: '/d/:deckId/present/:slug', element: <PlayerRoute mode="present" /> },
  { path: '/d/:deckId/study/:slug', element: <PlayerRoute mode="study" /> },
  { path: '/d/:deckId/:slug', element: <PlayerRoute mode="plain" /> },
  { path: '*', element: <NotFoundRoute /> },
]);
