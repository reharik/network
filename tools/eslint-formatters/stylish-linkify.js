// tools/eslint-formatters/stylish-linkify.js
// ESM-friendly wrapper around "stylish" that adds OSC-8 hyperlinks.
// - Links file header lines to file://path
// - Links each problem row to file://path:line:col

import path from 'node:path';

/** Strip ANSI color codes (basic + sufficient for ESLint output) */
const stripAnsi = (s) => s.replace(/\u001B\[[0-9;]*m/g, '');

/** Wrap display text as an OSC-8 hyperlink to target URL */
const makeLink = (display, target) =>
  `\u001B]8;;${target}\u0007${display}\u001B]8;;\u0007`;

/** resolve CJS/ESM default interop */
const resolveDefault = (m) => (m && (m.default ?? m)) || undefined;

/** Try to load a stylish formatter in a version-agnostic way */
let stylish;
try {
  // Preferred for ESLint >= 9 (install: npm i -D eslint-formatter-stylish)
  stylish = resolveDefault(await import('eslint-formatter-stylish'));
} catch {
  try {
    // Legacy internal path (ESLint <= 8 classic)
    stylish = resolveDefault(
      await import('eslint/lib/cli-engine/formatters/stylish'),
    );
  } catch {
    try {
      // Bridge path sometimes present
      stylish = resolveDefault(
        await import('@eslint/eslintrc/lib/cli-engine/formatters/stylish'),
      );
    } catch {
      // Minimal fallback
      stylish = (results) =>
        results
          .map((r) => r.filePath)
          .filter(Boolean)
          .join('\n');
    }
  }
}

const looksLikePathHeader = (plainLine) => {
  // A stylish file header is usually a lone path line, no leading spaces,
  // no trailing colon, and not a bullet/summary marker.
  if (!plainLine || /^\s/.test(plainLine)) return false;
  if (plainLine.endsWith(':')) return false;
  if (
    plainLine.startsWith('✖') ||
    plainLine.startsWith('✔') ||
    plainLine.startsWith('⚠')
  )
    return false;

  // Must look like a file path (has an extension)
  if (!/\.[a-zA-Z0-9]+$/.test(plainLine)) return false;
  return true;
};

export default (results, context = {}) => {
  // Render base "stylish" first
  const base = stylish(results, context);
  const cwd = context.cwd || process.cwd();
  const out = String(base);
  const lines = out.split('\n');

  let currentFileAbs = null;

  // Matches problem rows like: "  27:55  warning  …"
  const problemRow = /^\s*(\d+):(\d+)\s+\w+\s+/;

  const linked = lines
    .map((raw) => {
      const plain = stripAnsi(raw);

      // Detect and linkify the header file line
      if (looksLikePathHeader(plain)) {
        let filePath = plain;
        if (!path.isAbsolute(filePath)) filePath = path.join(cwd, filePath);
        currentFileAbs = filePath;
        return makeLink(raw, `file://${filePath}`);
      }

      // Linkify each problem line to file:line:col (using the last seen header)
      const m = plain.match(problemRow);
      if (m && currentFileAbs) {
        const [, lineStr, colStr] = m;
        // NEW (query params; col is optional)
        const url = `file://${currentFileAbs}?line=${lineStr}${colStr ? `&col=${colStr}` : ''}`;
        return makeLink(raw, url);
      }

      // Any other line: pass through
      return raw;
    })
    .join('\n');

  return linked;
};
