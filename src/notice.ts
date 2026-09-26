import { DEFAULTS, EVENTS, type Listeners, mergeListeners, splitOptions } from './defaults';
import type {
  NoticeCallback,
  NoticeEvent,
  NoticeOptions,
  NoticePosition,
  PromiseMessage,
  PromiseMessages,
  ResolvedOptions,
  SafeHTML,
} from './types';

type State = 'idle' | 'visible' | 'closing' | 'closed';
type PauseReason = 'api' | 'hover' | 'focus' | 'hidden';

/** How long to wait for a custom close animation before removing the notice anyway. */
const ANIMATION_FALLBACK_MS = 1000;
/** Matches the built-in fade durations in the stylesheet. */
const FADE_MS = 250;
const SWIPE_MIN_PX = 60;

let defaults: ResolvedOptions = { ...DEFAULTS };
let defaultListeners: Partial<Listeners> = {};
/** Notices on screen, oldest first. */
const active: NoticeJs[] = [];
let sequence = 0;
let warnedLegacyTimeout = false;

export class NoticeJs {
  readonly id: string;
  options: ResolvedOptions;
  /** The notice element, available after `show()`. */
  element: HTMLElement | null = null;

  private readonly ownOptions: Partial<ResolvedOptions>;
  private listeners: Listeners;
  private state: State = 'idle';
  private timer: ReturnType<typeof setTimeout> | undefined;
  private remaining = 0;
  private startedAt = 0;
  private readonly pauseReasons = new Set<PauseReason>();
  private bar: HTMLElement | null = null;
  private closing: Promise<void> | null = null;
  private cleanup: Array<() => void> = [];

  constructor(options: NoticeOptions = {}) {
    const { options: own, listeners } = splitOptions(options);
    this.ownOptions = own;
    this.options = { ...defaults, ...own };
    this.listeners = mergeListeners(defaultListeners, listeners);
    this.id = options.id ?? `noticejs-${++sequence}`;
    warnLegacyTimeout(this.options.timeout);
  }

  get isVisible(): boolean {
    return this.state === 'visible';
  }

  /**
   * Render the notice. If a notice with the same `id` is already on screen, that
   * notice is updated with these options and returned instead.
   */
  show(): NoticeJs {
    if (this.state !== 'idle' || typeof document === 'undefined') return this;

    const existing = active.find((notice) => notice.id === this.id && notice.isVisible);
    if (existing) {
      existing.update(this.ownOptions);
      this.state = 'closed';
      return existing;
    }

    const item = document.createElement('div');
    this.element = item;
    this.render();
    this.bindEvents(item);

    this.emit('beforeShow');
    if (this.options.modal) openModal();
    const container = getContainer(this.options.position);
    if (this.options.newestOnTop) container.prepend(item);
    else container.append(item);
    this.state = 'visible';
    active.push(this);
    this.emit('onShow');
    enforceLimit(this);

    const openClass = this.options.animation?.open;
    addClasses(item, openClass || 'noticejs-fadeIn');
    waitForAnimation(item, openClass ? ANIMATION_FALLBACK_MS : FADE_MS, () => {
      if (this.isVisible) this.emit('afterShow');
    });

    if (this.options.modal) {
      item.tabIndex = -1;
      item.focus();
    }
    if (document.hidden && this.options.pauseOnFocusLoss) this.hold('hidden');
    this.startTimer();
    return this;
  }

  /**
   * Change a notice's content or behaviour. On a visible notice this re-renders it and
   * restarts its countdown. `position` and `modal` cannot change once shown.
   */
  update(options: NoticeOptions): this {
    const { options: own, listeners } = splitOptions(options);
    if (this.state !== 'idle') {
      delete own.position;
      delete own.modal;
    }
    this.options = { ...this.options, ...own };
    for (const event of EVENTS) {
      this.listeners[event].push(...(listeners[event] ?? []));
    }
    warnLegacyTimeout(this.options.timeout);

    if (this.isVisible) {
      this.render();
      this.startTimer();
    }
    return this;
  }

  /** Close the notice. Resolves once it has been removed from the page. */
  close(): Promise<void> {
    if (this.closing) return this.closing;
    const item = this.element;
    if (this.state !== 'visible' || !item) {
      this.state = 'closed';
      this.closing = Promise.resolve();
      return this.closing;
    }

    this.state = 'closing';
    this.clearTimer();
    this.emit('onClose');

    this.closing = new Promise((resolve) => {
      const { animation } = this.options;
      removeClasses(item, animation?.open || 'noticejs-fadeIn');
      addClasses(item, animation?.close || 'noticejs-fadeOut');
      waitForAnimation(item, animation?.close ? ANIMATION_FALLBACK_MS : FADE_MS, () => {
        this.destroy();
        resolve();
      });
    });
    return this.closing;
  }

  /** Stop the countdown until `resume()` is called. */
  pause(): this {
    return this.hold('api');
  }

  resume(): this {
    return this.release('api');
  }

  on(event: NoticeEvent, callback: NoticeCallback): this {
    if (typeof callback === 'function' && EVENTS.includes(event)) {
      this.listeners[event].push(callback);
    }
    return this;
  }

  /** Remove one callback, or every callback for the event when none is given. */
  off(event: NoticeEvent, callback?: NoticeCallback): this {
    if (EVENTS.includes(event)) {
      this.listeners[event] = callback ? this.listeners[event].filter((cb) => cb !== callback) : [];
    }
    return this;
  }

  /** Current global defaults. */
  static get defaults(): Readonly<ResolvedOptions> {
    return defaults;
  }

  /** Change the defaults used by every notice created afterwards. */
  static overrideDefaults(options: NoticeOptions): typeof NoticeJs {
    const { options: own, listeners } = splitOptions(options);
    defaults = { ...defaults, ...own };
    defaultListeners = mergeListeners(defaultListeners, listeners);
    return NoticeJs;
  }

  static resetDefaults(): typeof NoticeJs {
    defaults = { ...DEFAULTS };
    defaultListeners = {};
    return NoticeJs;
  }

  /** The visible notice with this id, if any. */
  static get(id: string): NoticeJs | undefined {
    return active.find((notice) => notice.id === id);
  }

  /** Close every visible notice, or only those at one position. */
  static async closeAll(position?: NoticePosition): Promise<void> {
    const targets = active.filter((notice) => !position || notice.options.position === position);
    await Promise.all(targets.map((notice) => notice.close()));
  }

  static success(text: string, options: NoticeOptions = {}): NoticeJs {
    return new NoticeJs({ ...options, text, type: 'success' }).show();
  }

  static error(text: string, options: NoticeOptions = {}): NoticeJs {
    return new NoticeJs({ ...options, text, type: 'error' }).show();
  }

  static warning(text: string, options: NoticeOptions = {}): NoticeJs {
    return new NoticeJs({ ...options, text, type: 'warning' }).show();
  }

  static info(text: string, options: NoticeOptions = {}): NoticeJs {
    return new NoticeJs({ ...options, text, type: 'info' }).show();
  }

  /**
   * Show a loading notice that turns into a success or error notice when the promise
   * settles. Returns the original promise so it can still be awaited.
   */
  static promise<T>(
    input: Promise<T> | (() => Promise<T>),
    messages: PromiseMessages<T>,
    options: NoticeOptions = {},
  ): Promise<T> {
    const promise = typeof input === 'function' ? Promise.resolve().then(input) : input;
    const notice = new NoticeJs({
      type: 'info',
      ...options,
      ...toOptions(messages.loading),
      loading: true,
      timeout: false,
      progressBar: false,
    }).show();

    const settle = <V>(message: PromiseMessage<V>, value: V, type: 'success' | 'error') => {
      try {
        const next = typeof message === 'function' ? message(value) : message;
        notice.update({
          type,
          loading: false,
          timeout: options.timeout ?? defaults.timeout,
          progressBar: options.progressBar ?? defaults.progressBar,
          ...toOptions(next),
        });
      } catch (error) {
        console.error('[notice.js] promise message failed', error);
      }
    };
    promise.then(
      (value) => settle(messages.success, value, 'success'),
      (error: unknown) => settle(messages.error, error, 'error'),
    );
    return promise;
  }

  private render(): void {
    const item = this.element;
    if (!item) return;
    const o = this.options;

    item.className = '';
    addClasses(item, `noticejs-item item ${o.type} ${o.className}`);
    item.classList.toggle('noticejs-rtl', o.rtl);
    item.classList.toggle('noticejs-loading', o.loading);
    item.dataset.noticejsId = this.id;
    if (o.rtl) item.dir = 'rtl';
    else item.removeAttribute('dir');

    const live =
      o.ariaLive ?? (o.type === 'error' || o.type === 'warning' ? 'assertive' : 'polite');
    item.setAttribute('role', live === 'assertive' ? 'alert' : 'status');
    item.setAttribute('aria-live', live);
    item.setAttribute('aria-atomic', 'true');
    const fullWidth = o.position === 'top' || o.position === 'bottom';
    item.style.width = fullWidth
      ? ''
      : typeof o.width === 'number'
        ? `${o.width}px`
        : (o.width ?? '');

    const close = o.closeWith.includes('button') ? createCloseButton() : null;
    const children: HTMLElement[] = [];
    if (o.title) {
      const heading = createElement('div', 'noticejs-heading');
      const title = createElement('span', 'noticejs-title');
      title.textContent = o.title;
      heading.append(title);
      if (close) heading.append(close);
      children.push(heading);
    } else if (close) {
      children.push(close);
    }

    const body = createElement('div', 'noticejs-body');
    if (o.maxHeight) {
      body.style.maxHeight = `${o.maxHeight}px`;
      body.style.overflowY = 'auto';
    }
    if (o.loading) {
      const spinner = createElement('span', 'noticejs-spinner');
      spinner.setAttribute('aria-hidden', 'true');
      body.append(spinner);
    }
    const content = createElement('div', 'noticejs-content');
    if (typeof o.html === 'string') {
      const safe = o.sanitize ? o.sanitize(o.html) : o.html;
      (content as unknown as { innerHTML: SafeHTML }).innerHTML = safe;
    } else if (o.html) {
      content.append(o.html);
    } else {
      content.textContent = o.text;
    }
    body.append(content);

    if (o.actions.length > 0) {
      const actions = createElement('div', 'noticejs-actions');
      o.actions.forEach((action, index) => {
        const button = createElement('button', `noticejs-action ${action.className ?? ''}`);
        button.type = 'button';
        button.textContent = action.label;
        button.dataset.noticejsAction = String(index);
        actions.append(button);
      });
      body.append(actions);
    }
    children.push(body);

    this.bar = null;
    if (o.progressBar && o.timeout !== false && o.timeout > 0) {
      const progress = createElement('div', 'noticejs-progressbar');
      this.bar = createElement('div', 'noticejs-bar');
      this.bar.style.animationDuration = `${o.timeout}ms`;
      if (this.pauseReasons.size > 0) this.bar.style.animationPlayState = 'paused';
      progress.append(this.bar);
      children.push(progress);
    }

    item.replaceChildren(...children);
  }

  private bindEvents(item: HTMLElement): void {
    item.addEventListener('click', (event) => this.handleClick(event));
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        void this.close();
      }
    });
    item.addEventListener('mouseenter', () => {
      this.emit('onHover');
      if (this.options.pauseOnHover) this.hold('hover');
    });
    item.addEventListener('mouseleave', () => this.release('hover'));
    item.addEventListener('focusin', () => {
      if (this.options.pauseOnHover) this.hold('focus');
    });
    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget as Node | null)) this.release('focus');
    });
    this.bindSwipe(item);

    const onVisibility = () => {
      if (document.hidden && this.options.pauseOnFocusLoss) this.hold('hidden');
      else this.release('hidden');
    };
    document.addEventListener('visibilitychange', onVisibility);
    this.cleanup.push(() => document.removeEventListener('visibilitychange', onVisibility));
  }

  private bindSwipe(item: HTMLElement): void {
    let startX: number | null = null;
    let deltaX = 0;
    const reset = () => {
      startX = null;
      item.style.transform = '';
      item.style.opacity = '';
    };

    item.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'mouse' || !this.options.closeWith.includes('swipe')) return;
      startX = event.clientX;
      deltaX = 0;
    });
    item.addEventListener('pointermove', (event) => {
      if (startX === null) return;
      deltaX = event.clientX - startX;
      item.style.transform = `translateX(${deltaX}px)`;
      item.style.opacity = String(Math.max(0.2, 1 - Math.abs(deltaX) / 200));
    });
    item.addEventListener('pointerup', () => {
      if (startX === null) return;
      const threshold = Math.max(SWIPE_MIN_PX, item.offsetWidth * 0.3);
      if (Math.abs(deltaX) >= threshold) {
        startX = null;
        void this.close();
      } else {
        reset();
      }
    });
    item.addEventListener('pointercancel', reset);
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('.noticejs-close')) {
      void this.close();
      return;
    }

    const actionButton = target?.closest<HTMLElement>('[data-noticejs-action]');
    if (actionButton) {
      const action = this.options.actions[Number(actionButton.dataset.noticejsAction)];
      if (action) {
        try {
          action.onClick?.(this, event);
        } catch (error) {
          console.error('[notice.js] action failed', error);
        }
        if (action.closeOnClick !== false) void this.close();
      }
      return;
    }

    this.emit('onClick');
    if (this.options.closeWith.includes('click')) void this.close();
  }

  private startTimer(): void {
    this.clearTimer();
    const { timeout } = this.options;
    this.remaining = timeout === false ? 0 : Math.max(0, timeout);
    if (this.remaining > 0 && this.pauseReasons.size === 0) this.tick();
  }

  private tick(): void {
    this.startedAt = Date.now();
    this.timer = setTimeout(() => void this.close(), this.remaining);
  }

  private clearTimer(): void {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
  }

  private hold(reason: PauseReason): this {
    if (this.pauseReasons.size === 0 && this.timer !== undefined) {
      this.clearTimer();
      this.remaining = Math.max(1, this.remaining - (Date.now() - this.startedAt));
    }
    this.pauseReasons.add(reason);
    if (this.bar) this.bar.style.animationPlayState = 'paused';
    return this;
  }

  private release(reason: PauseReason): this {
    if (!this.pauseReasons.delete(reason) || this.pauseReasons.size > 0) return this;
    if (this.bar) this.bar.style.animationPlayState = '';
    if (this.isVisible && this.remaining > 0 && this.timer === undefined) this.tick();
    return this;
  }

  private destroy(): void {
    for (const fn of this.cleanup) fn();
    this.cleanup = [];

    const item = this.element;
    const container = item?.parentElement;
    item?.remove();
    if (container && container.childElementCount === 0) container.remove();

    const index = active.indexOf(this);
    if (index !== -1) active.splice(index, 1);
    this.state = 'closed';
    if (this.options.modal) closeModalIfUnused();
    this.emit('afterClose');
  }

  private emit(event: NoticeEvent): void {
    for (const callback of [...this.listeners[event]]) {
      try {
        callback.call(this, this);
      } catch (error) {
        console.error(`[notice.js] ${event} callback failed`, error);
      }
    }
  }
}

function toOptions(message: string | NoticeOptions): NoticeOptions {
  return typeof message === 'string' ? { text: message } : message;
}

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  addClasses(element, className);
  return element;
}

function createCloseButton(): HTMLButtonElement {
  const button = createElement('button', 'noticejs-close close');
  button.type = 'button';
  button.setAttribute('aria-label', 'Close notification');
  button.textContent = '×';
  return button;
}

function splitClasses(classes: string): string[] {
  return classes.split(/\s+/).filter(Boolean);
}

function addClasses(element: Element, classes: string): void {
  element.classList.add(...splitClasses(classes));
}

function removeClasses(element: Element, classes: string): void {
  element.classList.remove(...splitClasses(classes));
}

/** Run `done` once the element's own animation ends, or after `fallbackMs` if it never does. */
function waitForAnimation(element: Element, fallbackMs: number, done: () => void): void {
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    element.removeEventListener('animationend', onEnd);
    done();
  };
  const onEnd = (event: Event) => {
    if (event.target === element) finish();
  };
  element.addEventListener('animationend', onEnd);
  const timer = setTimeout(finish, fallbackMs);
}

function getContainer(position: NoticePosition): HTMLElement {
  const existing = document.querySelector<HTMLElement>(`.noticejs.noticejs-${position}`);
  if (existing) return existing;
  const container = createElement('div', `noticejs noticejs-${position}`);
  document.body.append(container);
  return container;
}

function openModal(): void {
  if (!document.querySelector('.noticejs-modal:not(.noticejs-modal-close)')) {
    document.body.append(createElement('div', 'noticejs-modal'));
  }
}

function closeModalIfUnused(): void {
  if (active.some((notice) => notice.isVisible && notice.options.modal)) return;
  const modal = document.querySelector('.noticejs-modal:not(.noticejs-modal-close)');
  if (!modal) return;
  modal.classList.add('noticejs-modal-close');
  waitForAnimation(modal, 400, () => modal.remove());
}

/** Close the oldest notices at a position once it holds more than its limit. */
function enforceLimit(newest: NoticeJs): void {
  const { position, maxVisible } = newest.options;
  const limit = position === 'top' || position === 'bottom' ? 1 : maxVisible;
  if (!limit || limit < 1) return;
  const visible = active.filter(
    (notice) => notice.isVisible && notice.options.position === position,
  );
  for (const notice of visible.slice(0, Math.max(0, visible.length - limit))) {
    if (notice !== newest) void notice.close();
  }
}

function warnLegacyTimeout(timeout: number | false): void {
  if (warnedLegacyTimeout || typeof timeout !== 'number' || timeout <= 0 || timeout >= 250) return;
  warnedLegacyTimeout = true;
  console.warn(
    `[notice.js] Since v1.0.0 \`timeout\` is the total time in milliseconds. ${timeout}ms looks like a pre-1.0 per-step value; multiply it by 100 to keep the old duration.`,
  );
}
