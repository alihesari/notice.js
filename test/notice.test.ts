import NoticeJsDefault, { NoticeJs } from '../src/index';

const $ = (selector: string) => document.querySelector<HTMLElement>(selector);
const $$ = (selector: string) => document.querySelectorAll<HTMLElement>(selector);

/** Long enough for every close/open animation fallback to fire. */
const settle = () => vi.advanceTimersByTimeAsync(1100);

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(async () => {
  const closing = NoticeJs.closeAll();
  await settle();
  await closing;
  NoticeJs.resetDefaults();
  document.body.replaceChildren();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('rendering', () => {
  it('exports the class as default and named export', () => {
    expect(NoticeJsDefault).toBe(NoticeJs);
  });

  it('renders a notice into a container for its position', () => {
    const notice = new NoticeJs({
      title: 'Saved',
      text: 'All good',
      position: 'bottomLeft',
    }).show();

    const container = $('.noticejs.noticejs-bottomLeft');
    expect(container).not.toBeNull();
    expect(notice.element?.parentElement).toBe(container);
    expect($('.noticejs-title')?.textContent).toBe('Saved');
    expect($('.noticejs-content')?.textContent).toBe('All good');
    expect(notice.element?.classList.contains('success')).toBe(true);
    expect(notice.element?.style.width).toBe('320px');
    expect(notice.isVisible).toBe(true);
  });

  it('renders text as plain text, never as HTML', () => {
    new NoticeJs({ text: '<img src=x onerror="alert(1)">' }).show();

    expect($('.noticejs-content img')).toBeNull();
    expect($('.noticejs-content')?.textContent).toBe('<img src=x onerror="alert(1)">');
  });

  it('passes html strings through the sanitizer', () => {
    const sanitize = vi.fn((html: string) => html.replace(/<script.*<\/script>/, ''));
    new NoticeJs({ html: '<b>bold</b><script>alert(1)</script>', sanitize }).show();

    expect(sanitize).toHaveBeenCalledOnce();
    expect($('.noticejs-content b')?.textContent).toBe('bold');
    expect($('.noticejs-content script')).toBeNull();
  });

  it('accepts a DOM node as html', () => {
    const node = document.createElement('em');
    node.textContent = 'node';
    new NoticeJs({ html: node }).show();

    expect($('.noticejs-content em')).toBe(node);
  });

  it('sets live-region semantics from the type', () => {
    const success = new NoticeJs({ type: 'success' }).show();
    const error = new NoticeJs({ type: 'error' }).show();
    const override = new NoticeJs({ type: 'error', ariaLive: 'polite' }).show();

    expect(success.element?.getAttribute('role')).toBe('status');
    expect(success.element?.getAttribute('aria-live')).toBe('polite');
    expect(error.element?.getAttribute('role')).toBe('alert');
    expect(error.element?.getAttribute('aria-live')).toBe('assertive');
    expect(override.element?.getAttribute('role')).toBe('status');
  });

  it('renders an accessible close button', () => {
    new NoticeJs({ text: 'x' }).show();

    const button = $('button.noticejs-close');
    expect(button?.getAttribute('type')).toBe('button');
    expect(button?.getAttribute('aria-label')).toBe('Close notification');
  });

  it('omits the close button when closeWith has no "button"', () => {
    new NoticeJs({ closeWith: ['click'] }).show();
    expect($('.noticejs-close')).toBeNull();
  });

  it('supports rtl, custom classes, width and maxHeight', () => {
    const notice = new NoticeJs({
      rtl: true,
      className: 'one two',
      width: '50vw',
      maxHeight: 120,
    }).show();

    const item = notice.element;
    expect(item?.classList.contains('noticejs-rtl')).toBe(true);
    expect(item?.dir).toBe('rtl');
    expect(item?.classList.contains('one')).toBe(true);
    expect(item?.classList.contains('two')).toBe(true);
    expect(item?.style.width).toBe('50vw');
    expect($('.noticejs-body')?.style.maxHeight).toBe('120px');
  });

  it('puts newest notices first when newestOnTop is set', () => {
    new NoticeJs({ text: 'first', newestOnTop: true }).show();
    new NoticeJs({ text: 'second', newestOnTop: true }).show();

    expect($$('.noticejs-content')[0]?.textContent).toBe('second');
  });

  it('shows a loading spinner', () => {
    new NoticeJs({ loading: true }).show();
    expect($('.noticejs-spinner')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('does nothing when shown twice', () => {
    const notice = new NoticeJs().show();
    expect(notice.show()).toBe(notice);
    expect($$('.noticejs-item')).toHaveLength(1);
  });
});

describe('options isolation', () => {
  it('does not leak one notice’s options into the next', () => {
    new NoticeJs({ type: 'error', title: 'Boom', position: 'topLeft' }).show();
    const second = new NoticeJs({ text: 'plain' });

    expect(second.options.type).toBe('success');
    expect(second.options.title).toBe('');
    expect(second.options.position).toBe('topRight');
    expect(NoticeJs.defaults.type).toBe('success');
  });

  it('applies and resets global defaults', () => {
    NoticeJs.overrideDefaults({ position: 'bottomCenter', timeout: 1000 });
    expect(new NoticeJs().options.position).toBe('bottomCenter');

    NoticeJs.resetDefaults();
    expect(new NoticeJs().options.position).toBe('topRight');
  });
});

describe('timing', () => {
  it('closes after timeout milliseconds in total', async () => {
    const notice = new NoticeJs({ timeout: 5000 }).show();

    await vi.advanceTimersByTimeAsync(4900);
    expect(notice.isVisible).toBe(true);

    await vi.advanceTimersByTimeAsync(100);
    expect(notice.isVisible).toBe(false);
    await settle();
    expect($('.noticejs-item')).toBeNull();
    expect($('.noticejs')).toBeNull();
  });

  it('stays open when timeout is false', async () => {
    const notice = new NoticeJs({ timeout: false }).show();
    await vi.advanceTimersByTimeAsync(60_000);

    expect(notice.isVisible).toBe(true);
    expect($('.noticejs-progressbar')).toBeNull();
  });

  it('drives the progress bar from the timeout', () => {
    new NoticeJs({ timeout: 4000 }).show();
    expect($('.noticejs-bar')?.style.animationDuration).toBe('4000ms');
  });

  it('pauses while hovered and resumes with the remaining time', async () => {
    const notice = new NoticeJs({ timeout: 1000 }).show();
    const item = notice.element as HTMLElement;

    await vi.advanceTimersByTimeAsync(600);
    item.dispatchEvent(new MouseEvent('mouseenter'));
    expect($('.noticejs-bar')?.style.animationPlayState).toBe('paused');

    await vi.advanceTimersByTimeAsync(5000);
    expect(notice.isVisible).toBe(true);

    item.dispatchEvent(new MouseEvent('mouseleave'));
    await vi.advanceTimersByTimeAsync(399);
    expect(notice.isVisible).toBe(true);
    await vi.advanceTimersByTimeAsync(1);
    expect(notice.isVisible).toBe(false);
  });

  it('does not pause on hover when pauseOnHover is false', async () => {
    const notice = new NoticeJs({ timeout: 1000, pauseOnHover: false }).show();
    notice.element?.dispatchEvent(new MouseEvent('mouseenter'));

    await vi.advanceTimersByTimeAsync(1000);
    expect(notice.isVisible).toBe(false);
  });

  it('pauses while focus is inside the notice', async () => {
    const notice = new NoticeJs({ timeout: 1000 }).show();
    notice.element?.dispatchEvent(new FocusEvent('focusin'));

    await vi.advanceTimersByTimeAsync(3000);
    expect(notice.isVisible).toBe(true);

    notice.element?.dispatchEvent(new FocusEvent('focusout', { relatedTarget: null }));
    await vi.advanceTimersByTimeAsync(1000);
    expect(notice.isVisible).toBe(false);
  });

  it('pauses while the page is hidden', async () => {
    const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    const notice = new NoticeJs({ timeout: 1000 }).show();

    await vi.advanceTimersByTimeAsync(3000);
    expect(notice.isVisible).toBe(true);

    hidden.mockReturnValue(false);
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(1000);
    expect(notice.isVisible).toBe(false);
  });

  it('supports manual pause and resume', async () => {
    const notice = new NoticeJs({ timeout: 1000 }).show().pause();
    await vi.advanceTimersByTimeAsync(3000);
    expect(notice.isVisible).toBe(true);

    notice.resume();
    await vi.advanceTimersByTimeAsync(1000);
    expect(notice.isVisible).toBe(false);
  });

  it('warns once about pre-1.0 per-step timeouts', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    new NoticeJs({ timeout: 30 });
    new NoticeJs({ timeout: 50 });

    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain('multiply it by 100');
  });
});

describe('closing', () => {
  it('closes from the close button', async () => {
    const notice = new NoticeJs().show();
    $('.noticejs-close')?.click();
    await settle();

    expect(notice.isVisible).toBe(false);
    expect($('.noticejs-item')).toBeNull();
  });

  it('closes on click only when closeWith includes "click"', async () => {
    const stays = new NoticeJs({ text: 'stays' }).show();
    stays.element?.querySelector<HTMLElement>('.noticejs-content')?.click();
    expect(stays.isVisible).toBe(true);

    const goes = new NoticeJs({ text: 'goes', closeWith: ['click'] }).show();
    goes.element?.querySelector<HTMLElement>('.noticejs-content')?.click();
    expect(goes.isVisible).toBe(false);
  });

  it('closes on Escape while focused', () => {
    const notice = new NoticeJs().show();
    notice.element?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(notice.isVisible).toBe(false);
  });

  it('closes on a long enough swipe, not on a short one', () => {
    const notice = new NoticeJs().show();
    const item = notice.element as HTMLElement;
    const swipe = (distance: number) => {
      item.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', clientX: 0 }));
      item.dispatchEvent(
        new PointerEvent('pointermove', { pointerType: 'touch', clientX: distance }),
      );
      item.dispatchEvent(
        new PointerEvent('pointerup', { pointerType: 'touch', clientX: distance }),
      );
    };

    swipe(20);
    expect(notice.isVisible).toBe(true);
    expect(item.style.transform).toBe('');

    swipe(150);
    expect(notice.isVisible).toBe(false);
  });

  it('ignores mouse drags and swipes when swipe is disabled', () => {
    const notice = new NoticeJs({ closeWith: ['button'] }).show();
    const item = notice.element as HTMLElement;
    item.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', clientX: 0 }));
    item.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'touch', clientX: 300 }));
    item.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', clientX: 300 }));

    expect(notice.isVisible).toBe(true);
  });

  it('returns the same promise when closed twice', async () => {
    const notice = new NoticeJs().show();
    const first = notice.close();
    expect(notice.close()).toBe(first);
    await settle();
    await expect(first).resolves.toBeUndefined();
  });

  it('uses custom close animation classes', () => {
    const notice = new NoticeJs({ animation: { open: 'in-a in-b', close: 'out' } }).show();
    expect(notice.element?.classList.contains('in-a')).toBe(true);

    void notice.close();
    expect(notice.element?.classList.contains('in-a')).toBe(false);
    expect(notice.element?.classList.contains('out')).toBe(true);
  });

  it('removes the notice as soon as its close animation ends', async () => {
    const notice = new NoticeJs().show();
    const closed = notice.close();
    notice.element?.dispatchEvent(new Event('animationend'));
    await closed;

    expect(notice.element?.isConnected).toBe(false);
  });

  it('closes all notices, or only those at one position', async () => {
    const a = new NoticeJs({ position: 'topLeft' }).show();
    const b = new NoticeJs({ position: 'topRight' }).show();

    void NoticeJs.closeAll('topLeft');
    expect(a.isVisible).toBe(false);
    expect(b.isVisible).toBe(true);

    void NoticeJs.closeAll();
    expect(b.isVisible).toBe(false);
  });

  it('closing a notice that was never shown is a no-op', async () => {
    await expect(new NoticeJs().close()).resolves.toBeUndefined();
  });
});

describe('callbacks', () => {
  it('fires each lifecycle callback exactly once with the instance', async () => {
    const calls: string[] = [];
    let self: unknown;
    const record = (name: string) =>
      function (this: NoticeJs, notice: NoticeJs) {
        calls.push(name);
        self = notice;
        expect(this).toBe(notice);
      };

    const notice = new NoticeJs({
      callbacks: {
        beforeShow: record('beforeShow'),
        onShow: [record('onShow')],
        afterShow: record('afterShow'),
        onClose: record('onClose'),
        afterClose: record('afterClose'),
      },
    }).show();
    await settle();
    void notice.close();
    await settle();

    expect(calls).toEqual(['beforeShow', 'onShow', 'afterShow', 'onClose', 'afterClose']);
    expect(self).toBe(notice);
  });

  it('does not carry callbacks over to later notices', () => {
    const onShow = vi.fn();
    new NoticeJs({ callbacks: { onShow } }).show();
    new NoticeJs().show();

    expect(onShow).toHaveBeenCalledOnce();
  });

  it('fires onClick and onHover', () => {
    const onClick = vi.fn();
    const onHover = vi.fn();
    const notice = new NoticeJs({ callbacks: { onClick, onHover } }).show();
    notice.element?.querySelector<HTMLElement>('.noticejs-content')?.click();
    notice.element?.dispatchEvent(new MouseEvent('mouseenter'));

    expect(onClick).toHaveBeenCalledOnce();
    expect(onHover).toHaveBeenCalledOnce();
  });

  it('supports on() and off()', async () => {
    const handler = vi.fn();
    const other = vi.fn();
    const notice = new NoticeJs().on('onClose', handler).on('onClose', other).off('onClose', other);
    notice.show();
    void notice.close();

    expect(handler).toHaveBeenCalledOnce();
    expect(other).not.toHaveBeenCalled();
    expect(notice.off('onClose').on('onClose', 'nope' as never)).toBe(notice);
  });

  it('applies default callbacks from overrideDefaults', () => {
    const onShow = vi.fn();
    NoticeJs.overrideDefaults({ callbacks: { onShow } });
    new NoticeJs().show();
    new NoticeJs().show();

    expect(onShow).toHaveBeenCalledTimes(2);
  });

  it('keeps going when a callback throws', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const after = vi.fn();
    new NoticeJs({
      callbacks: {
        onShow: () => {
          throw new Error('bad');
        },
        afterShow: after,
      },
    }).show();

    expect(error).toHaveBeenCalled();
    expect($('.noticejs-item')).not.toBeNull();
    await settle();
    expect(after).toHaveBeenCalledOnce();
  });
});

describe('actions', () => {
  it('runs an action and closes by default', () => {
    const onClick = vi.fn();
    const notice = new NoticeJs({
      actions: [{ label: 'Undo', onClick, className: 'undo' }],
    }).show();
    const button = $('.noticejs-action.undo');
    expect(button?.textContent).toBe('Undo');

    button?.click();
    expect(onClick).toHaveBeenCalledWith(notice, expect.any(MouseEvent));
    expect(notice.isVisible).toBe(false);
  });

  it('keeps the notice open when closeOnClick is false', () => {
    const onClick = vi.fn();
    const notice = new NoticeJs({
      closeWith: ['click'],
      actions: [{ label: 'Retry', onClick, closeOnClick: false }],
    }).show();
    $('.noticejs-action')?.click();

    expect(onClick).toHaveBeenCalledOnce();
    expect(notice.isVisible).toBe(true);
  });

  it('survives an action that throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const notice = new NoticeJs({
      actions: [
        {
          label: 'Bad',
          onClick: () => {
            throw new Error('bad');
          },
        },
      ],
    }).show();
    $('.noticejs-action')?.click();

    expect(notice.isVisible).toBe(false);
  });
});

describe('stacking', () => {
  it('updates a visible notice with the same id instead of adding another', () => {
    const first = new NoticeJs({ id: 'sync', text: 'Syncing…' }).show();
    const second = new NoticeJs({ id: 'sync', text: 'Synced', type: 'info' }).show();

    expect(second).toBe(first);
    expect($$('.noticejs-item')).toHaveLength(1);
    expect($('.noticejs-content')?.textContent).toBe('Synced');
    expect(NoticeJs.get('sync')).toBe(first);
  });

  it('closes the oldest notices beyond maxVisible', () => {
    const notices = [1, 2, 3].map((n) => new NoticeJs({ text: `${n}`, maxVisible: 2 }).show());

    expect(notices.map((n) => n.isVisible)).toEqual([false, true, true]);
  });

  it('keeps one notice at a time for top and bottom bars', () => {
    const first = new NoticeJs({ position: 'top' }).show();
    const second = new NoticeJs({ position: 'top' }).show();

    expect(first.isVisible).toBe(false);
    expect(second.isVisible).toBe(true);
  });
});

describe('modal', () => {
  it('keeps the overlay until the last modal notice closes', async () => {
    const a = new NoticeJs({ modal: true, timeout: false }).show();
    const b = new NoticeJs({ modal: true, timeout: false }).show();
    expect($$('.noticejs-modal')).toHaveLength(1);
    expect(document.activeElement).toBe(b.element);

    void a.close();
    await settle();
    expect($('.noticejs-modal')).not.toBeNull();

    void b.close();
    await settle();
    expect($('.noticejs-modal')).toBeNull();
  });
});

describe('update', () => {
  it('re-renders content and restarts the countdown', async () => {
    const notice = new NoticeJs({ text: 'Uploading', timeout: 1000 }).show();
    await vi.advanceTimersByTimeAsync(900);

    notice.update({ text: 'Uploaded', type: 'info', position: 'bottomLeft' });
    expect($('.noticejs-content')?.textContent).toBe('Uploaded');
    expect(notice.element?.classList.contains('info')).toBe(true);
    expect(notice.options.position).toBe('topRight');

    await vi.advanceTimersByTimeAsync(900);
    expect(notice.isVisible).toBe(true);
    await vi.advanceTimersByTimeAsync(100);
    expect(notice.isVisible).toBe(false);
  });

  it('only merges options before the notice is shown', () => {
    const notice = new NoticeJs().update({
      position: 'bottomLeft',
      callbacks: { onShow: vi.fn(() => {}) },
    });
    expect(notice.options.position).toBe('bottomLeft');
    expect(notice.element).toBeNull();
  });
});

describe('shortcuts and promise', () => {
  it('provides type shortcuts', () => {
    expect(NoticeJs.success('a').options.type).toBe('success');
    expect(NoticeJs.error('b').options.type).toBe('error');
    expect(NoticeJs.warning('c').options.type).toBe('warning');
    expect(NoticeJs.info('d', { title: 'Hi' }).options.title).toBe('Hi');
  });

  it('turns a loading notice into a success notice', async () => {
    let resolve!: (value: number) => void;
    const task = new Promise<number>((r) => {
      resolve = r;
    });

    const result = NoticeJs.promise(task, {
      loading: 'Saving…',
      success: (n) => `Saved ${n} items`,
      error: 'Failed',
    });
    const item = $('.noticejs-item');
    expect(item?.classList.contains('noticejs-loading')).toBe(true);
    expect(item?.classList.contains('info')).toBe(true);
    await vi.advanceTimersByTimeAsync(60_000);
    expect(item?.isConnected).toBe(true);

    resolve(3);
    await expect(result).resolves.toBe(3);
    expect($('.noticejs-content')?.textContent).toBe('Saved 3 items');
    expect(item?.classList.contains('success')).toBe(true);
    expect(item?.classList.contains('noticejs-loading')).toBe(false);

    await vi.advanceTimersByTimeAsync(3000);
    await settle();
    expect(item?.isConnected).toBe(false);
  });

  it('turns a loading notice into an error notice', async () => {
    const result = NoticeJs.promise(() => Promise.reject(new Error('nope')), {
      loading: { text: 'Deleting…', title: 'Please wait' },
      success: 'Deleted',
      error: (e) => ({ title: 'Error', text: (e as Error).message }),
    });

    await expect(result).rejects.toThrow('nope');
    await vi.advanceTimersByTimeAsync(0);
    expect($('.noticejs-item')?.classList.contains('error')).toBe(true);
    expect($('.noticejs-content')?.textContent).toBe('nope');
  });

  it('logs when a promise message function throws', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    await NoticeJs.promise(Promise.resolve(1), {
      loading: 'x',
      success: () => {
        throw new Error('bad');
      },
      error: 'y',
    });
    await vi.advanceTimersByTimeAsync(0);

    expect(error).toHaveBeenCalledWith('[notice.js] promise message failed', expect.any(Error));
  });
});
