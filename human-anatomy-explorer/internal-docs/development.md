# Development and release workflow

## Prerequisites

- Node.js 18+ and npm
- A current desktop browser with WebGL2 and `DecompressionStream`
- Python 3.11+ only for source download/refresh work

Install JavaScript dependencies with `npm install`.

## Everyday code change

1. Edit `src/`.
2. Run `npm run build`.
3. Open `release/head-atlas.html` and verify the interaction affected by the change.
4. Run `npm test` when tests exist or when adding logic to `src/model.js`.

The checked-in release is generated. Rebuild it whenever app source or data changes so the distributable artifact matches source.

## Suggested smoke test

- Initial load completes without the fallback error panel.
- Orbit, zoom, camera presets, Fit view, and fullscreen work.
- Search finds a known structure and selecting it updates the inspector.
- Hierarchy navigation, breadcrumbs, pagination, visibility toggles, Undo, Restore all, and Reset behave coherently.
- Material modes, opacity, labels, section planes, and exploded display update without console errors.
- Guided journey advances through all seven stops.
- PNG export downloads an image carrying the source attribution footer.

## Debugging

After successful boot, inspect `window.atlasDebug` in browser DevTools. It exposes a cloned `state`, the manifest, part/mesh maps, scene objects, current exploded layout, and helpers including `navigate()` and `fitView()`.

If startup fails, first check that the browser supports WebGL2 and `DecompressionStream`, then confirm `data/atlas.json` and `data/geometry.bin.gz` were generated together. A geometry offset mismatch can manifest as malformed meshes or a failed initialization.

## Release checklist

1. Build from a clean dependency install: `npm ci` then `npm run build`.
2. Perform the smoke test above in at least one Chromium-based browser.
3. Confirm `release/head-atlas.html` opens without a server and makes no runtime network requests.
4. Confirm attribution, educational disclaimer, and source coverage statements remain visible.
5. If geometry changed, review provenance pins, hashes, and upstream licensing notices.

## Current repository gaps

`package.json` references `scripts/prepare.py`, `scripts/package.mjs`, and `scripts/browser-test.mjs`, which are absent from this checkout; `tests/` currently contains no test files. Do not rely on those npm aliases until the missing scripts/tests are supplied or package metadata is updated.
