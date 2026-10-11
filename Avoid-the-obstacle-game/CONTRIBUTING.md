# Contributing

## Before changing code

Read [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for repository structure and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for runtime behavior. Keep changes focused: Luma is intentionally a small, dependency-free game.

## Workflow

1. Install with `npm ci`.
2. Run `npm run dev` and make the change under `public/`.
3. Run `npm run build`.
4. Complete the relevant checks in [docs/TESTING.md](docs/TESTING.md).
5. Update documentation when controls, commands, architecture, supported browsers, deployment behavior, or public file paths change.

## Pull request checklist

- The core one-tap control and one-hit game-over behavior still work.
- Touch, mouse, and keyboard input remain supported.
- The layout was checked on portrait mobile and desktop.
- `npm ci` and `npm run build` pass.
- New public assets are validated by the build script and served locally.
- No secrets, local configuration, generated output, or unrelated files are added.
- User-facing or operational changes are documented.

## Dependency policy

Prefer browser and Node standard APIs. If a dependency is necessary, explain its purpose, commit the updated lockfile, and verify that it is compatible with a static Vercel deployment. Do not add Python packages unless the project gains an actual Python component; if that happens, replace the explanatory-only `requirements.txt` with pinned runtime requirements.

## Reporting security issues

Do not publish credentials or private deployment details in an issue. Report a security concern privately to the repository owner through the repository host's private security-reporting feature when available.
