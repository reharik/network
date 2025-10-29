import { createBaseTypeScriptConfig } from '../../eslint-shared.js';

export default [
  { ignores: ['**/_typia/**', '**/dist/**'] },
  ...(await createBaseTypeScriptConfig()),
];
