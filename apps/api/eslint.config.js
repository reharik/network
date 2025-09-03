import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'build', 'node_modules'] },
  {
    files: ['**/*.ts'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked, // type-aware rules
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
    },
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
  },
);
