import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * CSS layer order is import order. Feature stylesheets are imported by the components that
 * own them and must only ever ADD to this base, never depend on each other.
 *
 *   fonts            self-hosted Heebo faces
 *   tokens/primitive raw scales — colour ramps, space, radii, motion. No meaning.
 *   tokens/semantic  ROLES mapped from the primitives + themes + viewing distances.
 *                    Components read these and only these.
 *   base             document reset and element defaults
 *   layout           document-level layout: #root, the viewport, print rules
 *   primitives       the handful of classes shared across features
 */
import './theme/fonts/fonts.css';
import './theme/tokens/primitive.css';
import './theme/tokens/semantic.css';
import './theme/base.css';
import './theme/layout.css';
import './theme/primitives.css';

import { registerBuiltInScenes } from './scenes';
import App from './App';

registerBuiltInScenes();

const el = document.getElementById('root');
if (!el) throw new Error('#root not found');

createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
