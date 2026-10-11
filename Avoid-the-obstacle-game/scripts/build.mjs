import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// The site is already static: validate it in place without generating duplicates.
const root = new URL('../public/', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
for (const path of ['src/styles.css', 'src/game.js']) {
  assert(html.includes(`./${path}`), `index.html must reference ${path}`);
  const contents = await readFile(new URL(path, root), 'utf8');
  assert(contents.trim().length > 0, `${path} must not be empty`);
}
console.log('Build verified: public/ is ready for static deployment.');
