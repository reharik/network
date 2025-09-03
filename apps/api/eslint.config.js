import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig
(
  { ignores: ['**/dist/**', '**/build/**', '**/node_modules/**','**/db/**'] },
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked, // Keep type-aware rules
    ],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true, // auto-detect nearest tsconfig.json
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      jest,
      prettier: prettierPlugin,
    },
    rules: {
      ...jest.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      // Middle ground: Keep type safety but disable only the most problematic unsafe rules
      '@typescript-eslint/no-unsafe-assignment': 'warn', // Warn instead of error
      '@typescript-eslint/no-unsafe-call': 'warn', // Warn instead of error
      '@typescript-eslint/no-unsafe-member-access': 'warn', // Warn instead of error
      '@typescript-eslint/no-unsafe-return': 'warn', // Warn instead of error
      '@typescript-eslint/no-unsafe-argument': 'warn', // Warn instead of error
    },
  },
);
