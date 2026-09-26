# Contributing

Thanks for taking the time to contribute to notice.js.

## Before you start

Search the [issues](https://github.com/alihesari/notice.js/issues) and [pull requests](https://github.com/alihesari/notice.js/pulls) first to see whether your problem or idea is already being discussed. For a new feature, open an issue before writing code, so we can agree on the API.

## Setup

You need Node.js 22.19 or newer for the dev tools (see `.nvmrc`). The library itself runs in the browser.

```bash
git clone https://github.com/<your-username>/notice.js.git
cd notice.js
npm install
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm test` | Run the test suite (Vitest + happy-dom). |
| `npm run test:watch` | Run the tests in watch mode. |
| `npm run coverage` | Run the tests with a coverage report. |
| `npm run lint` / `npm run lint:fix` | Check or fix formatting and lint rules (Biome). |
| `npm run typecheck` | Type-check the source and the tests. |
| `npm run build` | Build `dist/` (ESM, CJS, browser bundle, types, CSS). |
| `npm run size` | Check the bundle size budget. |
| `npm run site` | Build and copy `dist/` into `site/`. Serve it with `npx serve site` to try the demo. |
| `npm run check` | Everything CI runs. Please run it before opening a pull request. |

## Pull requests

- Keep each pull request focused on one problem or feature.
- Add or update tests in `test/` for any behaviour change.
- Update `README.md` and the `Unreleased` section of `CHANGELOG.md` when you change the public API.
- Don't commit `dist/`. It is built in CI and on release.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for messages (`feat:`, `fix:`, `docs:`, `chore:`…).

## Releasing (maintainers)

1. Update `version` in `package.json` and move the `Unreleased` changelog entry under the new version.
2. Merge to `master`, then tag the merge commit: `git tag v1.2.3 && git push origin v1.2.3`.
3. The release workflow checks that the tag matches `package.json`, runs `npm run check`, publishes to npm with provenance, and creates a GitHub release with the built files attached.
