# Security policy

## Supported versions

Only the latest 1.x release receives security fixes.

## Reporting a vulnerability

Please **don't** open a public issue. Report it privately through [GitHub security advisories](https://github.com/alihesari/notice.js/security/advisories/new) instead. You'll get a reply within a few days, and a fix or mitigation plan once the report is confirmed.

## Scope notes

- `text` and `title` are always rendered with `textContent` and are safe for untrusted input.
- `html` strings are assigned to `innerHTML`. Passing untrusted content through `html` without a `sanitize` function is a misuse, not a vulnerability in notice.js.
- The package has no runtime dependencies, and every npm release is published from GitHub Actions with [provenance](https://docs.npmjs.com/generating-provenance-statements).
