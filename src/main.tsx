import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * CSS layer order is load order — `cssCodeSplit` is off in the offline build, so every
 * stylesheet lands in one file in import sequence. Feature stylesheets are imported by the
 * components that own them and must only ever ADD to this base, never depend on each other.
 *
 *   tokens/scale    structural tokens — spacing, type scale, radii, easing (no colour)
 *   tokens/palette  the brand kit that fills the colour tokens in
 *   layout          document-level layout: #root, the viewport, print rules
 *   primitives      the handful of classes shared across features
 */
import './theme/tokens/scale.css';
import './theme/tokens/palette.dark-blue.css';
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
