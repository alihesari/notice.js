import type { NoticeJs } from './notice';

export type NoticeType = 'success' | 'error' | 'warning' | 'info';

export type NoticePosition =
  | 'top'
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'middleLeft'
  | 'middleCenter'
  | 'middleRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomCenter'
  | 'bottomRight';

/** Ways a user can dismiss a notice. `swipe` only reacts to touch and pen input. */
export type CloseTrigger = 'button' | 'click' | 'swipe';

export type NoticeEvent =
  | 'beforeShow'
  | 'onShow'
  | 'afterShow'
  | 'onClose'
  | 'afterClose'
  | 'onClick'
  | 'onHover';

export type NoticeCallback = (this: NoticeJs, notice: NoticeJs) => void;

/**
 * Anything `innerHTML` accepts: a string, or a `TrustedHTML` object when the page
 * enforces Trusted Types.
 */
export type SafeHTML = string | { toString(): string };

export type HtmlSanitizer = (html: string) => SafeHTML;

export interface NoticeAnimation {
  /** Class(es) added while the notice enters, e.g. `'animate__animated animate__fadeInRight'`. */
  open?: string | null;
  /** Class(es) added while the notice leaves. */
  close?: string | null;
}

export interface NoticeAction {
  label: string;
  onClick?: (notice: NoticeJs, event: MouseEvent) => void;
  className?: string;
  /** Close the notice after the action runs. Defaults to `true`. */
  closeOnClick?: boolean;
}

export interface NoticeOptions {
  /** Stable id. Showing a notice whose id is already on screen updates that notice instead. */
  id?: string;
  title?: string;
  /** Plain text. Always rendered with `textContent`, so it is safe for untrusted input. */
  text?: string;
  /**
   * Rich content. A DOM node is inserted as-is. A string is passed through `sanitize`
   * (when set) and assigned to `innerHTML`, so never pass untrusted strings without a sanitizer.
   */
  html?: string | Node | null;
  sanitize?: HtmlSanitizer | null;
  type?: NoticeType;
  position?: NoticePosition;
  /** Total time on screen in milliseconds, or `false` to stay until dismissed. */
  timeout?: number | false;
  progressBar?: boolean;
  closeWith?: CloseTrigger[];
  /** Pause the countdown while the pointer is over the notice or focus is inside it. */
  pauseOnHover?: boolean;
  /** Pause the countdown while the browser tab is hidden. */
  pauseOnFocusLoss?: boolean;
  animation?: NoticeAnimation | null;
  /** Dim the page behind the notice. */
  modal?: boolean;
  /** Width in px (number) or any CSS length (string). `null` keeps the stylesheet width. */
  width?: number | string | null;
  /** Max body height in px before the content scrolls. */
  maxHeight?: number | null;
  newestOnTop?: boolean;
  /** Maximum notices visible at this position; the oldest are closed first. */
  maxVisible?: number | null;
  rtl?: boolean;
  /** Show a spinner. Useful for pending work; see `NoticeJs.promise`. */
  loading?: boolean;
  /** Extra class(es) added to the notice element. */
  className?: string;
  actions?: NoticeAction[];
  /** Overrides the live-region politeness derived from `type`. */
  ariaLive?: 'polite' | 'assertive' | 'off';
  callbacks?: Partial<Record<NoticeEvent, NoticeCallback | NoticeCallback[]>>;
}

export type ResolvedOptions = Required<Omit<NoticeOptions, 'id' | 'ariaLive' | 'callbacks'>> &
  Pick<NoticeOptions, 'id' | 'ariaLive'>;

export type PromiseMessage<T> = string | NoticeOptions | ((value: T) => string | NoticeOptions);

export interface PromiseMessages<T> {
  loading: string | NoticeOptions;
  success: PromiseMessage<T>;
  error: PromiseMessage<unknown>;
}
