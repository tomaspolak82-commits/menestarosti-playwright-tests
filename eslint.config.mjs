// @ts-check
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

// Locators live only in src/pages/ (DRY rule in CLAUDE.md).
const locatorMethods =
  '/^(locator|getByRole|getByLabel|getByTestId|getByText|getByPlaceholder|getByAltText|getByTitle)$/';

export default defineConfig(
  {
    ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**', 'blob-report/**'],
  },
  {
    files: ['**/*.{ts,mjs}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },
  {
    files: ['src/tests/**/*.ts'],
    extends: [playwright.configs['flat/recommended']],
    rules: {
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-force-option': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-skipped-test': ['error', { allowConditional: true }],
    },
  },
  {
    files: ['src/tests/**/*.ts', 'src/helpers/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `CallExpression[callee.property.name=${locatorMethods}]`,
          message: 'Locators belong in Page Objects (src/pages/), not in tests or helpers.',
        },
      ],
    },
  },
);
