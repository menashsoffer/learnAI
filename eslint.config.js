import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  { ignores: ['dist', 'legacy', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // Invariant #4: content is 100% declarative — no raw HTML injection anywhere.
      'react/no-danger': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXAttribute[name.name="dangerouslySetInnerHTML"]',
          message: 'Content must be declarative. Use src/blocks/ instead of dangerouslySetInnerHTML.',
        },
      ],
    },
  },
  {
    // Invariant #3: the engine is pure TS with zero React / DOM-framework imports.
    files: ['src/engine/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'src/engine must stay framework-light (no React).' },
            { name: 'react-dom', message: 'src/engine must stay framework-light (no React).' },
            { name: 'zustand', message: 'Use zustand/vanilla in the store wrapper only.' },
          ],
          patterns: ['react/*', '@/react/*', '@/scenes/*'],
        },
      ],
    },
  },
);
