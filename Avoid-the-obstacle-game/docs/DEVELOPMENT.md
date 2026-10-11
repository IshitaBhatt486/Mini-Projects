# Development guide

## Repository layout

```text
public/
  index.html             Semantic page structure and game controls
  src/
    styles.css           Layout, responsive rules, presentation, and animation
    game.js              WebGL renderer, procedural geometry, audio, and gameplay
scripts/
  build.mjs              Validates the files Vercel will publish
  serve.mjs              Minimal local static server
package.json             Supported commands and Node runtime
package-lock.json        Reproducible npm installation
vercel.json              Static Vercel deployment configuration
requirements.txt         Declares that Python packages are not used
```

`public/` is both the source of the static site and the deployment output. The build step validates it in place. It deliberately does not bundle, minify, or copy files, which keeps local and deployed behavior identical.

## Setup

Install Node.js 24, then run:

```sh
npm ci
npm run dev
```

The server listens only on `127.0.0.1`. It exposes the three public game files and returns 404 for repository files such as `package.json` and `.git/config`. Editing does not trigger live reload; refresh the browser after saving.

## Working conventions

- Keep runtime code dependency-free unless a dependency solves a clear problem that cannot reasonably be handled by browser APIs.
- Preserve touch, mouse, and keyboard input when changing controls.
- Keep gameplay updates inside the fixed 120 Hz simulation step. Visual-only effects can use render time.
- Keep deployable files under `public/` and update `scripts/build.mjs` if a new required asset is introduced.
- Avoid network requests in the game. Its offline-friendly, instant-loading character is part of the design.
- Respect `prefers-reduced-motion` for DOM animation and retain visible keyboard focus styles.

## Common changes

### Tune flight physics

Gravity, flap velocity, obstacle gap, and collision radius are defined near the game state in `public/src/game.js`. Change one variable at a time and complete the gameplay checklist in [TESTING.md](TESTING.md), especially the narrow mobile viewport check.

### Change visual styling

DOM styling belongs in `public/src/styles.css`. WebGL colors, geometry, lighting, and world composition live in `public/src/game.js`. The scene uses an orthographic projection whose horizontal extent adapts to the viewport.

### Add a deployable file

Place it under `public/`, reference it with a relative URL, and add it to the asset list in `scripts/build.mjs` so a missing or empty file fails the build. If the local server must expose it, add an explicit entry to its route map in `scripts/serve.mjs`.

## Configuration

There are no environment variables. The local server accepts `PORT` or a `--port` argument; the argument takes precedence:

```powershell
$env:PORT=3001; npm run dev
npm run dev -- --port 3002
```

Do not add secrets to `public/`: everything in that directory is published.
