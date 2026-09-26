import type { NoticeCallback, NoticeEvent, NoticeOptions, ResolvedOptions } from './types';

export const EVENTS: readonly NoticeEvent[] = [
  'beforeShow',
  'onShow',
  'afterShow',
  'onClose',
  'afterClose',
  'onClick',
  'onHover',
];

const BASE_DEFAULTS: ResolvedOptions = {
  title: '',
  text: '',
  html: null,
  sanitize: null,
  type: 'success',
  position: 'topRight',
  timeout: 3000,
  progressBar: true,
  closeWith: ['button', 'swipe'],
  pauseOnHover: true,
  pauseOnFocusLoss: true,
  animation: null,
  modal: false,
  width: 320,
  maxHeight: null,
  newestOnTop: false,
  maxVisible: null,
  rtl: false,
  loading: false,
  className: '',
  actions: [],
};

export const DEFAULTS: Readonly<ResolvedOptions> = Object.freeze(BASE_DEFAULTS);

export type Listeners = Record<NoticeEvent, NoticeCallback[]>;

/** Split user options into plain options and normalized callback lists. */
export function splitOptions(options: NoticeOptions): {
  options: Partial<ResolvedOptions>;
  listeners: Partial<Listeners>;
} {
  const { callbacks, ...rest } = options;
  const listeners: Partial<Listeners> = {};
  if (callbacks) {
    for (const event of EVENTS) {
      const value = callbacks[event];
      if (value) listeners[event] = (Array.isArray(value) ? value : [value]).filter(isFunction);
    }
  }
  return { options: stripUndefined(rest), listeners };
}

export function mergeListeners(...sources: Partial<Listeners>[]): Listeners {
  const merged = {} as Listeners;
  for (const event of EVENTS) {
    merged[event] = sources.flatMap((source) => source[event] ?? []);
  }
  return merged;
}

function stripUndefined<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as Partial<T>;
}

function isFunction(value: unknown): value is NoticeCallback {
  return typeof value === 'function';
}
