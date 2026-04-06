// Syncs the version from package.json into public/sw.js (CACHE_VERSION).
// Runs automatically before `npm start` and `npm run build` via npm script hooks.
// package.json is the single source of truth.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PKG_PATH = path.join(ROOT, 'package.json');
const SW_PATH = path.join(ROOT, 'public', 'sw.js');

const { version } = require(PKG_PATH);
const target = `v${version}`;

const sw = fs.readFileSync(SW_PATH, 'utf8');
const re = /const CACHE_VERSION = '([^']*)';/;
const match = sw.match(re);

if (!match) {
  console.error('[sync-version] Could not find CACHE_VERSION line in public/sw.js');
  process.exit(1);
}

if (match[1] === target) {
  console.log(`[sync-version] sw.js already at ${target}`);
  process.exit(0);
}

const updated = sw.replace(re, `const CACHE_VERSION = '${target}';`);
fs.writeFileSync(SW_PATH, updated);
console.log(`[sync-version] Updated sw.js: ${match[1]} → ${target}`);
