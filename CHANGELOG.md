# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-26

A full rewrite in TypeScript. The API stays familiar (`new NoticeJs(options).show()`), but a few defaults changed to fix long-standing bugs, so read the migration guide below.

### Added
- TypeScript source with bundled type definitions, plus ESM, CommonJS and `<script>` (IIFE) builds with an `exports` map.
- `NoticeJs.promise()` for loading notices that turn into success or error notices.
- Action buttons (`actions`).
- Instance methods `close()`, `update()`, `pause()`, `resume()` and `off()`, and the properties `element`, `id` and `isVisible`.
- Static helpers `NoticeJs.success()`, `.error()`, `.warning()`, `.info()`, `.closeAll()`, `.get()` and `.resetDefaults()`.
- Deduplication by `id`, and a `maxVisible` limit per position.
- Countdown pauses on hover, on keyboard focus and while the tab is hidden (`pauseOnHover`, `pauseOnFocusLoss`).
- Swipe to dismiss on touch devices (`closeWith: ['swipe']`).
- `html` option with a `sanitize` hook and Trusted Types support. DOM nodes are accepted too.
- Accessibility: `role="status"`/`role="alert"` live regions, a real `<button>` to close with an accessible name, <kbd>Esc</kbd> to dismiss, focus moves to modal notices, and `prefers-reduced-motion` support.
- Theming with CSS custom properties. Default colours now meet WCAG AA contrast.
- `loading`, `maxHeight`, `className` and `ariaLive` options.
- Test suite (Vitest), linting (Biome), bundle size budget (size-limit), package checks (publint), and a demo site at noticejs.com.
- npm releases are published with provenance from GitHub Actions.

### Changed
- **Breaking:** `timeout` is the total time on screen in milliseconds. The default is `3000`. It used to be the delay for each 1% of the progress bar.
- **Breaking:** `text` is rendered as plain text. Use `html` for markup.
- **Breaking:** `show()` returns the `NoticeJs` instance instead of the element.
- **Breaking:** `require('notice.js')` returns `{ NoticeJs, default }`. The browser build still sets `window.NoticeJs`.
- **Breaking:** IE11 is no longer supported. The build targets ES2020.
- The default `closeWith` is `['button', 'swipe']`.
- The stylesheet is plain CSS with custom properties. SCSS sources are no longer shipped.
- Repository links point to `github.com/alihesari/notice.js`.

### Fixed
- Options from one notice leaked into every later notice, because the global defaults object was mutated.
- Callbacks ran twice and piled up across notices.
- `afterClose` was never called.
- Callbacks ran against the shared options instead of the notice instance.
- The documented `timeout` values were 100× too long.
- The progress-bar timer could close a notice twice (thanks to @llsccm in #23).
- Closing one modal notice removed the overlay while other modal notices were still open.
- `scroll.maxHeight` produced an invalid `undefinedpx` style.

### Removed
- The `scroll` option (use `maxHeight`), `bower.json`, Travis CI, and the webpack and Babel toolchain.

### Migrating from 0.5.x

```js
// 0.5.x: 50ms per step × 100 steps = 5 seconds
new NoticeJs({ text: 'Saved', timeout: 50 }).show();
// 1.0.0: total milliseconds
new NoticeJs({ text: 'Saved', timeout: 5000 }).show();

// 0.5.x: text could contain markup
new NoticeJs({ text: '<b>Saved</b>' }).show();
// 1.0.0: use html (and a sanitizer for anything user-provided)
new NoticeJs({ html: '<b>Saved</b>' }).show();

// 0.5.x
const element = new NoticeJs({ text: 'Hi' }).show();
// 1.0.0
const notice = new NoticeJs({ text: 'Hi' }).show();
notice.element; // the element
notice.close();

// 0.5.x
new NoticeJs({ scroll: { maxHeight: 200 } });
// 1.0.0
new NoticeJs({ maxHeight: 200 });
```

In development, a `timeout` below 250 logs a one-time console warning, which helps you find old per-step values.

## [0.5.0] - 2025-11-02

### Added
- Modern build system upgrade from Webpack 3 to Webpack 5
- Babel 7 upgrade (from Babel 6)
- Comprehensive interactive demo page (`examples/demo.html`)
- Support for function-based callbacks (in addition to array format)
- Improved documentation with examples and timeout documentation
- Better error handling for callback registration

### Changed
- Default timeout behavior: 30ms per step = 3 seconds total (was always 3s, now documented)
- Build configuration modernized
- Dependencies updated to latest stable versions

### Fixed
- Fixed callback handling errors when callbacks provided as functions
- Fixed demo timeout values for consistent 5-second auto-close
- Regenerated dist files with new build system
- Fixed "push is not a function" and "forEach is not a function" errors in callbacks

### Removed
- Removed old dependencies: `extract-text-webpack-plugin`, `node-sass`, `babel-cli`, `babel-core`

### Migration from 0.4.0

If you're upgrading from 0.4.0, no breaking changes to the API. The library maintains full backward compatibility.

**Build changes:**
- If you were using the source files directly, the build process is now more modern but produces the same output
- All API methods remain the same

**Callback improvements:**
You can now use callbacks in two ways (both work):

```javascript
// Old way (still works)
callbacks: {
    onShow: [function() { console.log('Shown!'); }]
}

// New way (also works)
callbacks: {
    onShow: function() { console.log('Shown!'); }
}
```

## [0.4.0] - Previous Release

### Added
- Initial stable release
- Basic notification functionality
- Support for multiple types, positions, and animations
- Progress bar indicator
- RTL language support

[1.0.0]: https://github.com/alihesari/notice.js/compare/v0.5.0...v1.0.0
[0.5.0]: https://github.com/alihesari/notice.js/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/alihesari/notice.js/releases/tag/v0.4.0

