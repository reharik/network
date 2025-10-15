// scripts/gen-awilix-container.ts
import { RESOLVER, type ResolverOptions } from 'awilix';
import fg from 'fast-glob';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import 'tsconfig-paths/register';

type Entry = {
  key: string; // DI key
  relImport: string; // import path relative to src/di
  exportName: string; // named export carrying RESOLVER
  ifaceName?: string; // expected interface name (e.g., AuthService)
  ifaceFound: boolean; // interface/type was found in source
  sourcePath: string; // absolute path to file
};

// Type for exports that have RESOLVER metadata
type ExportWithResolver = {
  [RESOLVER]?: ResolverOptions<unknown>;
};

// ---- config: keep in sync with container.loadModules ----
const here = path.dirname(new URL(import.meta.url).pathname);
const appRoot = path.resolve(here, '../..'); // adjust if your script lives at apps/api/src/codeGen
const srcDir = path.join(appRoot, 'src');

const outDir = path.join(srcDir, 'di');
const outPath = path.join(outDir, 'awilix.autoload.d.ts');

const PATTERNS = [
  'services/**/*.{ts,tsx,js,mjs,cjs}',
  'repositories/**/*.{ts,tsx,js,mjs,cjs}',
  'controllers/**/*.{ts,tsx,js,mjs,cjs}',
  'middleware/**/*.{ts,tsx,js,mjs,cjs}',
  'routes/**/*.{ts,tsx,js,mjs,cjs}',
  'koaServer.{ts,js}',
];

// Exclude index files since they only re-export and don't have RESOLVER metadata
const EXCLUDE_PATTERNS = ['**/index.{ts,tsx,js,mjs,cjs}'];

// must match your container’s naming
const formatName = (name: string) => {
  if (name.startsWith('create')) {
    return name.substring(6).charAt(0).toLowerCase() + name.substring(7);
  }
  return name;
};

const header = `/* AUTO-GENERATED. DO NOT EDIT.
Re-run \`npm run gen:container\` after adding/removing services.
*/
 `;

const expectedInterfaceFromExport = (exportName: string): string | undefined =>
  exportName.startsWith('create') ? exportName.slice(6) : undefined;

const hasExportedInterfaceOrType = (source: string, ifaceName: string): boolean => {
  const reInterface = new RegExp(
    String.raw`export\s+(?:declare\s+)?interface\s+${ifaceName}\b`,
    'm',
  );
  const reType = new RegExp(String.raw`export\s+(?:declare\s+)?type\s+${ifaceName}\s*=`, 'm');
  // match "export { Foo }" or "export { Foo as Bar }" (either Foo or Bar equal to ifaceName)
  const reNamed = new RegExp(String.raw`export\s*\{\s*([^}]+)\s*\}`, 'm');

  if (reInterface.test(source) || reType.test(source)) {
    return true;
  }

  const match = source.match(reNamed);
  if (match) {
    // split items inside braces, normalize spaces
    const items = match[1].split(',').map((s) => s.trim());
    for (const item of items) {
      // "Name" or "Orig as Alias"
      const m = item.match(/^(\w+)(?:\s+as\s+(\w+))?$/);
      if (!m) continue;
      const [, orig, alias] = m;
      if (orig === ifaceName || alias === ifaceName) return true;
    }
  }
  return false;
};

const relImportFromDi = (absFile: string) => {
  let relFromDi = path.relative(outDir, absFile).replace(/\\/g, '/'); // posix slashes
  relFromDi = relFromDi.replace(/\.[^.]+$/, ''); // drop extension
  if (!relFromDi.startsWith('.')) relFromDi = './' + relFromDi;
  return relFromDi;
};

const run = async () => {
  const allFiles = await fg(PATTERNS, { cwd: srcDir, absolute: true });
  const excludeFiles = await fg(EXCLUDE_PATTERNS, { cwd: srcDir, absolute: true });
  const excludeSet = new Set(excludeFiles);

  const files = allFiles.filter((file) => !excludeSet.has(file));

  if (!files.length) {
    console.warn('⚠️  No files matched patterns under src/. Check PATTERNS and folder structure.');
  } else {
    console.log(
      `Found ${files.length} candidate files (excluded ${excludeFiles.length} index files).`,
    );
  }

  const usedKeys = new Set<string>();
  const entries: Entry[] = [];
  let skippedImports = 0;
  let noResolverExports = 0;

  for (const abs of files) {
    let mod: Record<string, unknown>;
    try {
      mod = (await import(pathToFileURL(abs).href)) as Record<string, unknown>;
    } catch (e) {
      skippedImports++;
      console.warn(`Skipping import ${path.relative(process.cwd(), abs)}: ${(e as Error).message}`);
      continue;
    }

    let foundAnyInFile = 0;
    for (const [exportName, exported] of Object.entries(mod)) {
      const kind = typeof exported;
      if (!(exported && (kind === 'object' || kind === 'function'))) continue;

      const resolverMeta = (exported as ExportWithResolver)[RESOLVER];
      if (!resolverMeta) continue;

      foundAnyInFile++;

      const key =
        typeof resolverMeta.name === 'string' && resolverMeta.name.length > 0
          ? resolverMeta.name
          : formatName(exportName);

      if (usedKeys.has(key)) continue;
      usedKeys.add(key);

      const ifaceName = expectedInterfaceFromExport(exportName);

      let ifaceFound = false;
      if (ifaceName) {
        try {
          const source = await fs.readFile(abs, 'utf8');
          ifaceFound = hasExportedInterfaceOrType(source, ifaceName);
        } catch {
          // ignore read error
        }
      }

      entries.push({
        key,
        relImport: relImportFromDi(abs),
        exportName,
        ifaceName,
        ifaceFound,
        sourcePath: abs,
      });
    }

    if (foundAnyInFile === 0) {
      noResolverExports++;
    }
  }

  console.log(
    `Resolvable exports: ${entries.length} (imports skipped: ${skippedImports}, files with no RESOLVER exports: ${noResolverExports})`,
  );

  // ---- build .d.ts ----
  let body = '';
  for (const e of entries) {
    const capKey = e.key ? e.key[0].toUpperCase() + e.key.slice(1) : e.key;

    if (e.ifaceName && e.ifaceFound) {
      body += `type ${capKey} = import('${e.relImport}').${e.ifaceName};\n\n`;
    } else {
      body += `type ${capKey}Type = typeof import('${e.relImport}')['${e.exportName}'];
type ${capKey} =
  ${capKey}Type extends new (...args: any) => infer I ? I :
  ${capKey}Type extends (...args: any) => infer R ? R :
  ${capKey}Type extends { (...args: any): infer C } ? C :
  unknown;

`;
    }
  }

  const fields =
    entries.length === 0
      ? '  // (no autoloaded items discovered)'
      : entries
          .map((e) => {
            const capKey = e.key ? e.key[0].toUpperCase() + e.key.slice(1) : e.key;
            return `  ${e.key}: ${capKey};`;
          })
          .join('\n');

  const out = header + body + `export interface AutoLoadedContainer {\n${fields}\n}\n`;

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outPath, out, 'utf8');
  console.log(`Wrote ${path.relative(process.cwd(), outPath)} with ${entries.length} items`);

  const missing = entries.filter((e) => e.ifaceName && !e.ifaceFound);
  if (missing.length) {
    const lines = missing
      .map(
        (e) =>
          ` - ${e.key} (export "${e.exportName}" in ${path.relative(
            process.cwd(),
            e.sourcePath,
          )}) → expected interface "${e.ifaceName}"`,
      )
      .join('\n');
    console.warn(`⚠️ The following services were missing their interface:\n${lines}`);
  }
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
