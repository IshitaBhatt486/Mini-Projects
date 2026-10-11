# Forma — Head & Brain Atlas

(Built to explore ChatGPT's Astra model)

Forma is a browser-based, interactive 3D atlas of selected head and upper-neck anatomy. It presents licensed source meshes as searchable, selectable structures with hierarchy navigation, camera presets, exploded layouts, clipping planes, labels, and PNG export.

The production output is one offline-capable HTML file: `release/head-atlas.html`. It embeds the app, manifest, and compressed geometry; no server or runtime network request is needed after building.

> Educational reference only. This atlas is not clinically validated, is not a diagnostic tool, and its clipping planes are display cuts—not medical scans. Coverage is intentionally partial.

![alt text](image.png)
![alt text](image-1.png)

## Quick start

Requires Node.js 18+ (for the build target and modern browser APIs) and npm.

```powershell
npm install
npm run build
```

Open `release/head-atlas.html` in a current WebGL2-capable browser. For local development, serve the repository with any static-file server; opening the built artifact directly is also supported.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run build` | Bundles the application and writes the standalone release HTML. |
| `npm test` | Runs Node’s test runner against `tests/*.test.mjs` when tests are present. |
| `python scripts/fetch-sources.py` | Downloads the pinned upstream geometry inputs and refreshes `data/source-hashes.json`. Requires Python 3.11+ and network access. |
| `node scripts/prepare.mjs` | Rebuilds `data/atlas.json` and `data/geometry.bin.gz` from the cached source inputs. |

`package.json` also currently declares `prepare:data`, `package`, and `test:browser`, but their referenced scripts are not present in this checkout. Use the commands above until those scripts are added or the entries are corrected.

## Repository layout

```text
src/                 Browser UI, scene control, and pure state/layout helpers
data/                Generated atlas manifest, compressed geometry, source checksums
scripts/             Source acquisition, geometry preparation, and standalone build
.cache/              Downloaded upstream inputs (generated; not a release asset)
release/             Generated distributable artifact
internal-docs/       Maintainer documentation
```

## Architecture at a glance

The build replaces placeholders in `src/index.html` with CSS, a bundled `src/main.js`, `data/atlas.json`, and base64-encoded `data/geometry.bin.gz`. At startup, the browser inflates the geometry, creates one Three.js mesh per atlas part, and drives visibility, material, layout, and camera behavior from a shared state object.

For implementation details, source provenance, and maintenance workflows, see [internal-docs](internal-docs/README.md).

## Data provenance and attribution

The atlas combines a selected subset of:

- BodyParts3D 4.0 geometry (CC BY 4.0)
- Additional BodyParts3D 4.3 meshes retaining CC BY-SA 2.1 Japan notices
- Z-Anatomy 1.4.0 geometry (CC BY-SA 4.0)

Original source identifiers are retained in the manifest. `data/source-hashes.json` records SHA-256 checksums for the pinned downloads used to prepare the checked-in data. Preserve required attribution and license notices when redistributing modified artifacts. Full provenance and transformation notes are in [internal-docs/data-pipeline.md](internal-docs/data-pipeline.md).

No project-level license file is currently included in this repository; clarify distribution terms before publishing code changes independently of the upstream asset obligations.
