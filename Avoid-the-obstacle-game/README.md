# Luma

Luma is a small 3D tap-to-fly game for desktop and mobile browsers. It uses vanilla JavaScript, WebGL, and Web Audio; every shape, animation, and sound is generated at runtime, so the deployed game has no external assets or CDN dependencies.

## Quick start

Requirements: Node.js 24 and npm 11 or newer.

```sh
npm ci
npm run dev
```

Open <http://127.0.0.1:3000>. To use another port:

```sh
npm run dev -- --port 3001
```

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Reproduce the dependency installation from `package-lock.json` |
| `npm run dev` | Serve `public/` locally on port 3000 |
| `npm run build` | Check JavaScript syntax and validate deployable assets |
| `npm run preview` | Serve the production-ready `public/` directory |

The project has no third-party npm or Python dependencies. `requirements.txt` exists to make the absence of Python packages explicit for deployment systems that inspect it automatically.

## Controls

- Tap, click, Space, or Arrow Up: start, flap, and retry.
- P or Escape: pause and resume.
- Sound button: enable or mute generated audio.

The personal best is stored in browser local storage. It is tied to the current origin, so a local score does not transfer to the deployed URL.

## Documentation

- [Development guide](docs/DEVELOPMENT.md) — structure, workflow, conventions, and common changes.
- [Architecture](docs/ARCHITECTURE.md) — runtime systems, game loop, rendering, audio, state, and persistence.
- [Testing](docs/TESTING.md) — automated checks and manual acceptance checklist.
- [Deployment](docs/DEPLOYMENT.md) — Vercel setup, verification, rollback, and troubleshooting.
- [Contributing](CONTRIBUTING.md) — change workflow and pull request checklist.

## Deployment

The repository is ready for Vercel. Import it with the **Other** framework preset; `vercel.json` supplies the install command, build command, and `public/` output directory. No environment variables, server, database, or paid service is required. See the [deployment guide](docs/DEPLOYMENT.md) for the complete procedure.

## Browser support

Luma requires WebGL, Web Audio, and standard modern browser APIs. Current Chrome, Edge, Firefox, and Safari releases are the intended targets. Sound begins only after the player enables it, in line with browser autoplay policies.

## License

No license has been assigned. The source remains all-rights-reserved unless the repository owner adds a license file.
