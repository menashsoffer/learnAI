import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // `docs` is committed build output, not source.
  { ignores: ['dist', 'node_modules'] },
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
      /**
       * `const { field: _drop, ...rest } = obj` is how the tests build a deliberately
       * INVALID fixture by omitting one required field. The binding exists to remove the
       * key, never to be read — which is precisely what `ignoreRestSiblings` is for.
       */
      '@typescript-eslint/no-unused-vars': [
        'error',
        { ignoreRestSiblings: true, argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'JSXAttribute[name.name="dangerouslySetInnerHTML"]',
          message:
            'Content must be declarative. Use src/blocks/ instead of dangerouslySetInnerHTML.',
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
          patterns: ['react/*', '@/react/*', '@/scenes/*', '@/ui/*', '@/assets/*'],
        },
      ],
    },
  },

  {
    /**
     * These files export a value NEXT TO a component on purpose, which is exactly what
     * react-refresh warns about:
     *   - a scene module is `defineScene({...})` + its Component (the plugin contract);
     *   - the illustration registry is a lookup map + its renderer;
     *   - the presentation provider ships its hooks beside it, as providers do.
     * Splitting each into two files to satisfy the linter would make all three worse, and a
     * permanently-noisy lint run is a lint run people stop reading. Fast Refresh falls back
     * to a full reload for these files in dev; nothing else is affected.
     */
    files: [
      'src/scenes/**/*.tsx',
      'src/assets/illustrations/index.tsx',
      'src/react/PresentationProvider.tsx',
      // The interactive blocks ship `assemblePrompt` beside them; it is the pure half of
      // the builder and is unit-tested directly, which is worth more than fast refresh here.
      'src/blocks/interactive.tsx',
    ],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  // Last: turns off every rule that would fight Prettier over formatting.
  prettier,
);
