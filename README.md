# notice.js

[![npm version](https://img.shields.io/npm/v/notice.js.svg)](https://www.npmjs.com/package/notice.js)
[![CI](https://github.com/alihesari/notice.js/actions/workflows/ci.yml/badge.svg)](https://github.com/alihesari/notice.js/actions/workflows/ci.yml)
[![bundle size](https://img.shields.io/bundlephobia/minzip/notice.js)](https://bundlephobia.com/package/notice.js)
[![types](https://img.shields.io/npm/types/notice.js)](https://www.npmjs.com/package/notice.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> Tiny, dependency-free toast notifications. Typed, accessible, and safe by default.

**[Live demo → noticejs.com](https://noticejs.com)**

- **Written in TypeScript.** Types ship with the package, and there are ESM, CommonJS and `<script>` builds.
- **Zero dependencies,** under 4 kB of JavaScript gzipped.
- **Safe by default.** `text` is never parsed as HTML. Rich content is opt-in through `html`, with a sanitizer hook and Trusted Types support.
- **Accessible.** Notices use ARIA live regions, a real `<button>` to close, and <kbd>Esc</kbd> to dismiss. The countdown pauses on hover, focus and hidden tabs, and animations respect `prefers-reduced-motion`.
- **Modern API:** promise notices, action buttons, `update()` and `close()`, deduplication by `id`, and a `maxVisible` limit per position.
- **Themeable** with CSS custom properties, plus 11 positions, RTL support, a modal overlay, swipe to dismiss, and custom animations (for example Animate.css).

## Install

```bash
npm install notice.js
```

```ts
import { NoticeJs } from 'notice.js';
import 'notice.js/noticejs.css';

NoticeJs.success('Profile saved');
```

Or use a `<script>` tag. It exposes `window.NoticeJs`:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/notice.js@1/dist/noticejs.css">
<script src="https://cdn.jsdelivr.net/npm/notice.js@1/dist/notice.js"></script>
```

## Usage

```ts
new NoticeJs({
  title: 'Saved',
  text: 'Your changes are live.',
  type: 'success',          // 'success' | 'info' | 'warning' | 'error'
  position: 'topRight',
  timeout: 5000,            // total ms on screen, or false to stay until closed
}).show();

// Shortcuts
NoticeJs.success('Done');
NoticeJs.error('Something went wrong', { title: 'Error' });
NoticeJs.warning('Disk almost full');
NoticeJs.info('New version available');
```

### Promises

A loading notice turns into a success or error notice when the promise settles. The original promise is returned, so you can still `await` it.

```ts
const user = await NoticeJs.promise(saveProfile(), {
  loading: 'Saving…',
  success: (user) => `Saved ${user.name}`,
  error: (err) => ({ title: 'Save failed', text: (err as Error).message }),
});
```

### Actions

```ts
new NoticeJs({
  text: 'Email archived',
  actions: [
    { label: 'Undo', onClick: () => restoreEmail() },
    { label: 'Details', onClick: openDetails, closeOnClick: false },
  ],
}).show();
```

### Updating, closing and deduplicating

```ts
const notice = new NoticeJs({ text: 'Uploading…', timeout: false }).show();
notice.update({ text: 'Uploaded', type: 'success', timeout: 3000 });
await notice.close();

// Showing a notice whose id is already on screen updates that notice instead of stacking a copy.
new NoticeJs({ id: 'offline', text: 'You are offline', type: 'warning' }).show();

NoticeJs.closeAll();             // or NoticeJs.closeAll('bottomLeft')
NoticeJs.get('offline')?.close();
```

### Rich content, safely

`text` is always rendered with `textContent`, so user input can go straight in. Use `html` only for markup you control, or pass a sanitizer:

```ts
import DOMPurify from 'dompurify';

new NoticeJs({ html: markdownToHtml(comment), sanitize: DOMPurify.sanitize }).show();

// A DOM node is inserted as-is
new NoticeJs({ html: myElement }).show();
```

On pages that enforce [Trusted Types](https://developer.mozilla.org/docs/Web/API/Trusted_Types_API), have `sanitize` return a `TrustedHTML` value from your policy.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `''` | Heading text. |
| `text` | `string` | `''` | Plain-text message. |
| `html` | `string \| Node \| null` | `null` | Rich content, used instead of `text`. Strings go through `sanitize`. |
| `sanitize` | `(html) => string \| TrustedHTML` | `null` | Sanitizer for `html` strings. |
| `type` | `'success' \| 'info' \| 'warning' \| 'error'` | `'success'` | Colour and ARIA role. |
| `position` | see [Positions](#positions) | `'topRight'` | Where the notice appears. |
| `timeout` | `number \| false` | `3000` | Total time on screen in ms. `false` keeps the notice until it is closed. |
| `progressBar` | `boolean` | `true` | Show the countdown bar. |
| `closeWith` | `('button' \| 'click' \| 'swipe')[]` | `['button', 'swipe']` | How users can dismiss the notice. <kbd>Esc</kbd> always works while focus is inside it. |
| `pauseOnHover` | `boolean` | `true` | Pause the countdown on hover and focus. |
| `pauseOnFocusLoss` | `boolean` | `true` | Pause the countdown while the tab is hidden. |
| `actions` | `{ label, onClick?, className?, closeOnClick? }[]` | `[]` | Action buttons. |
| `id` | `string` | auto | Stable id for deduplication and `NoticeJs.get()`. |
| `maxVisible` | `number \| null` | `null` | Notice limit for this position. The oldest close first. |
| `newestOnTop` | `boolean` | `false` | Insert new notices first. |
| `modal` | `boolean` | `false` | Dim the page and move focus to the notice. |
| `animation` | `{ open?, close? } \| null` | `null` | CSS classes for enter and exit animations. |
| `width` | `number \| string \| null` | `320` | Width in px, or any CSS length. |
| `maxHeight` | `number \| null` | `null` | Max body height in px before the content scrolls. |
| `rtl` | `boolean` | `false` | Right-to-left layout. |
| `loading` | `boolean` | `false` | Show a spinner. |
| `className` | `string` | `''` | Extra classes for the notice element. |
| `ariaLive` | `'polite' \| 'assertive' \| 'off'` | from `type` | Override the announcement politeness. |
| `callbacks` | `{ [event]: fn \| fn[] }` | `{}` | Lifecycle callbacks, see below. |

Set defaults for every notice with `NoticeJs.overrideDefaults({ position: 'bottomRight' })`. `NoticeJs.resetDefaults()` restores them.

### Positions

`topLeft`, `topCenter`, `topRight`, `middleLeft`, `middleCenter`, `middleRight`, `bottomLeft`, `bottomCenter` and `bottomRight`, plus the full-width bars `top` and `bottom`, which show one notice at a time.

### Instance API

| Member | Description |
| --- | --- |
| `show()` | Render the notice. Returns the notice, or the already-visible notice with the same `id`. |
| `update(options)` | Change content or behaviour. The notice re-renders and its countdown restarts. |
| `close()` | Close the notice. Returns a promise that resolves once it has been removed. |
| `pause()` / `resume()` | Stop and restart the countdown. |
| `on(event, fn)` / `off(event, fn?)` | Add or remove callbacks. |
| `element`, `id`, `options`, `isVisible` | Current state. |

### Callbacks

`beforeShow`, `onShow`, `afterShow`, `onClose`, `afterClose`, `onClick` and `onHover`. Each callback is called once, with the notice as both `this` and its first argument.

```ts
new NoticeJs({
  text: 'Hello',
  callbacks: { afterClose: (notice) => console.log(`${notice.id} closed`) },
}).show();
```

## Theming

Every colour and size is a CSS custom property:

```css
:root {
  --noticejs-success-bg: #0f766e;
  --noticejs-success-accent: #115e59;
  --noticejs-radius: 12px;
  --noticejs-width: 360px;
  --noticejs-font-family: 'Inter', sans-serif;
}
```

See [`src/noticejs.css`](src/noticejs.css) for the full list. The default colours keep white text above WCAG AA contrast.

## Upgrading from 0.x

1.0.0 includes breaking changes. The [changelog](CHANGELOG.md#migrating-from-05x) has the full migration guide. In short:

- `timeout` is now the **total time in milliseconds** (default `3000`). It used to be a per-step delay, where `30` meant 3 seconds. Multiply old values by 100.
- `text` is plain text. Pass markup through `html` instead.
- `show()` returns the notice instance. The element is available as `notice.element`.
- The `scroll` option is replaced by `maxHeight`.
- IE11 is no longer supported.

## Browser support

The last two versions of Chrome, Edge, Firefox and Safari. The library is safe to import during server-side rendering, because the DOM is only touched in `show()`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). To report a security issue, see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © [Ali Hesari](https://alihesari.com)
