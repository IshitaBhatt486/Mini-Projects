# Testing and quality checks

## Automated checks

Install and validate from a clean checkout:

```sh
npm ci
npm run build
```

The build performs a JavaScript syntax check, confirms that `index.html` links the required stylesheet and script, and confirms that both files contain data. There are no unit-test dependencies or generated build artifacts.

## Local production check

```sh
npm run preview
```

Open <http://127.0.0.1:3000> and use the browser developer console to confirm there are no errors. `/`, `/src/styles.css`, and `/src/game.js` should return successfully. An unknown path and `/package.json` should return 404.

## Manual acceptance checklist

Run this checklist after changing gameplay, input, rendering, layout, or audio.

### Core loop

- Title screen renders the animated creature, world, and Take flight button.
- A tap, click, Space, or Arrow Up starts the game and applies a flap.
- Gravity lowers the creature between taps.
- Obstacles move from right to left and continue spawning indefinitely.
- Passing a complete gap increases the score exactly once.
- Touching a tower, floor, or ceiling ends the run immediately.
- The result card shows run score and personal best.
- Fly again starts a clean run while preserving the personal best.

### Controls and lifecycle

- P, Escape, and the pause button freeze and resume the game.
- Switching tabs or blurring the window pauses an active run.
- The sound toggle changes its accessible label and tones play only when enabled.
- Buttons can be reached and activated with a keyboard.

### Responsive presentation

- Test portrait phone dimensions around 390 × 844 CSS pixels.
- Test a landscape phone and a desktop viewport.
- Confirm the creature and usable gap remain visible at each size.
- Confirm cards fit without clipping and safe-area insets protect controls.
- Confirm browser scrolling and double-tap zoom do not interrupt play.

### Persistence and fallback

- Reloading retains the best score on the same origin.
- Clearing site data resets it.
- A browser without WebGL receives the fallback message rather than a blank page.

## Release gate

A release is ready when `npm ci` and `npm run build` pass, the core-loop checklist passes on one current desktop browser and one current mobile browser, and the Vercel preview shows no console or asset-loading errors.
