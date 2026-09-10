import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// CSS cascade order matters (cssCodeSplit is off in the offline build): tokens -> palette -> app.
import './theme/tokens/base.css';
import './theme/tokens/palette.dark-blue.css';
import './app.css';

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
