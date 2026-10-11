# Deployment guide

## Vercel configuration

The checked-in `vercel.json` configures Luma as a static project:

| Setting | Value |
| --- | --- |
| Framework | None / Other |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `public` |
| Environment variables | None |

The build validates files in place; Vercel publishes `public/` directly.

## Deploy from Git

1. Commit `public/`, `scripts/`, `package.json`, `package-lock.json`, and `vercel.json`, then push the repository to your Git provider.
2. In Vercel, create a project and import the repository.
3. If this project is inside a larger repository, set the root directory to the directory containing `vercel.json`.
4. Select the **Other** framework preset. Leave the commands populated from `vercel.json` unchanged.
5. Deploy and open the generated preview URL.

Every later push creates a preview or production deployment according to the Git branch settings in Vercel.

## Pre-deployment verification

```sh
npm ci
npm run build
npm run preview
```

Complete the release gate in [TESTING.md](TESTING.md). Since browser local storage is origin-specific, the deployed site starts with its own personal-best value.

## Post-deployment verification

- Load the deployment on desktop and mobile over HTTPS.
- Confirm HTML, CSS, and JavaScript load without 404 responses.
- Complete at least one gap and confirm the score updates.
- Reload and confirm the personal best persists.
- Enable audio after interaction and confirm tones play.
- Inspect the browser console for WebGL, CSP, or asset errors.

## Rollback

Use Vercel's deployment history to promote the previous known-good deployment. Because the game has no backend or schema, rollback requires no data migration. Personal bests remain in each player's browser.

## Troubleshooting

### Build reports a missing asset

Confirm `public/index.html`, `public/src/styles.css`, and `public/src/game.js` are present, non-empty, and committed. Confirm the HTML uses `./src/styles.css` and `./src/game.js` exactly.

### The deployment is blank or unstyled

Confirm the Vercel output directory is `public`, and inspect the browser network panel for 404 responses. File paths are case-sensitive on deployment even when they appear to work on Windows.

### Sound is silent

The player must enable sound after interacting with the page. Mobile silent mode, OS volume, and browser autoplay policy can also suppress Web Audio.

### Best score disappeared

Local storage is isolated by origin and browser profile. Preview, production, localhost, and custom-domain URLs each have separate values. Private browsing or clearing site data also removes the value.

### Port 3000 is already in use

```sh
npm run preview -- --port 3001
```

The server also accepts a valid integer through the `PORT` environment variable.
