# Architecture

## Runtime

`src/index.html` supplies the application shell and placeholders for inline CSS, data, and JavaScript. `scripts/build.mjs` uses esbuild to bundle `src/main.js`, then writes a single `release/head-atlas.html` containing:

1. `src/style.css`
2. `data/atlas.json` as `window.ATLAS`
3. `data/geometry.bin.gz` as base64 `window.GEOMETRY`
4. The browser bundle

At boot, `main.js` base64-decodes and inflates the geometry with `DecompressionStream`, then builds a `THREE.BufferGeometry` and `THREE.Mesh` for every manifest part. Geometry stays in a shared coordinate frame; each mesh is centered locally while its world position receives the original center.

## Main modules

| File | Responsibility |
| --- | --- |
| `src/main.js` | DOM events, Three.js scene, data hydration, render loop, camera, UI rendering, export. |
| `src/model.js` | Pure state defaults and helpers for visibility, opacity, bounds, exploded layout, and undo history. |
| `src/style.css` | Responsive presentation styling. |
| `data/atlas.json` | Hierarchical node graph and part metadata, offsets, counts, bounds, source IDs, and coverage note. |
| `data/geometry.bin.gz` | Gzipped packed position/index buffers referenced by manifest byte offsets. |

## State and interaction model

`initialState()` owns navigation scope, selected node, hidden part IDs, per-node opacity, material mode, explosion amount, labels, pagination, and three clipping-plane settings. `commit()` snapshots state into `History` before mutations that should be undoable, calls `refresh()`, and optionally refits the camera.

Visibility is the intersection of two conditions: the part belongs to the active scope and it is not in `hidden`. Opacity is multiplicative from the selected leaf upward through its ancestry. The exploded layout only lays out the visible page of child groups; its normalized scale is deliberately not anatomical scale.

## Rendering details

- Three directional/hemisphere lights and `OrbitControls` establish the scene.
- Raycasting selects visible meshes; double-click focuses the selected node.
- Materials derive color from the top-level system group and respond to porcelain, wireframe, and transparent modes.
- Labels are ordinary DOM elements projected from 3D points each frame.
- Clipping uses Three.js local clipping planes; clipped surfaces are not capped.
- `window.atlasDebug` is intentionally exposed after boot for manual inspection and browser automation.

## Change boundaries

Prefer putting deterministic, non-DOM logic in `model.js` and cover it with Node tests. Keep source metadata and binary offsets synchronized: any update to the atlas manifest requires rebuilding the geometry artifact too. Do not manually edit byte offsets in `atlas.json`.
