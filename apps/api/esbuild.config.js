import * as esbuild from 'esbuild';

const result = await esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outdir: 'dist',
  minify: false,
  minifyIdentifiers: false,
  keepNames: true,
  sourcemap: 'external',
  sourcesContent: true,
  tsconfig: 'tsconfig.json',
  external: [
    'pg',
    'mysql',
    'mysql2',
    'sqlite3',
    'better-sqlite3',
    'tedious',
    'oracledb',
    'pg-query-stream',
  ],
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
});

console.log('Build result:', result);
