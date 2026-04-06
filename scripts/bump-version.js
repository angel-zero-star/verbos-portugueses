// Bumps the last numeric segment of the version in package.json (e.g. 1.3 → 1.4).
// Uses regex replace to preserve existing formatting/whitespace exactly.

const fs = require('fs');
const path = require('path');

const PKG_PATH = path.join(__dirname, '..', 'package.json');
const text = fs.readFileSync(PKG_PATH, 'utf8');

const re = /"version":\s*"([^"]+)"/;
const match = text.match(re);

if (!match) {
  console.error('[bump-version] Could not find "version" field in package.json');
  process.exit(1);
}

const oldVersion = match[1];
const parts = oldVersion.split('.').map(Number);

if (parts.some(Number.isNaN)) {
  console.error(`[bump-version] Non-numeric version segment in "${oldVersion}", refusing to bump`);
  process.exit(1);
}

parts[parts.length - 1] += 1;
const newVersion = parts.join('.');

fs.writeFileSync(PKG_PATH, text.replace(re, `"version": "${newVersion}"`));
console.log(`[bump-version] ${oldVersion} → ${newVersion}`);
