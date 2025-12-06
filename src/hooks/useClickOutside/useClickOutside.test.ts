import { renderHook } from '@testing-library/react';
import { useClickOutside } from './useClickOutside';

describe('useClickOutside hook', () => {
  const createMockEvent = (target: HTMLElement): MouseEvent => {
    const event = new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
    });

    event.stopPropagation = vi.fn();
    event.preventDefault = vi.fn();

    Object.defineProperty(event, 'target', {
      value: target,
      writable: false,
    });

    return event;
  };

  const createTouchEvent = (target: HTMLElement): TouchEvent => {
    const event = new Event('touchstart', {
      bubbles: true,
      cancelable: true,
    }) as unknown as TouchEvent;

    Object.defineProperty(event, 'target', {
      value: target,
      writable: false,
    });

    Object.defineProperties(event, {
      touches: {
        value: [] as Touch[],
        writable: false,
      },
      targetTouches: {
        value: [] as Touch[],
        writable: false,
      },
      changedTouches: {
        value: [] as Touch[],
        writable: false,
      },
      stopPropagation: {
        value: vi.fn(),
        writable: true,
      },
      preventDefault: {
        value: vi.fn(),
        writable: true,
      },
    });

    return event;
  };

  test('should call handler when clicking outside the ref element', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    const outsideElement = document.createElement('button');

    renderHook(() => useClickOutside(ref, handler));

    const event = createMockEvent(outsideElement);
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(event);
  });

  test('should NOT call handler when clicking inside the ref element', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    const insideElement = document.createElement('span');
    ref.current.appendChild(insideElement);

    renderHook(() => useClickOutside(ref, handler));

    const event = createMockEvent(insideElement);
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  test('should NOT call handler when clicking on excluded ref', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    const excludeRef = { current: document.createElement('button') };
    const excludedElement = document.createElement('span');
    excludeRef.current.appendChild(excludedElement);

    renderHook(() => useClickOutside(ref, handler, [excludeRef]));

    const event = createMockEvent(excludedElement);
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  test('should call handler when clicking outside both ref and excluded refs', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    const excludeRef = { current: document.createElement('button') };
    const outsideElement = document.createElement('section');

    renderHook(() => useClickOutside(ref, handler, [excludeRef]));

    const event = createMockEvent(outsideElement);
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('should handle touch events', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    const outsideElement = document.createElement('button');

    renderHook(() => useClickOutside(ref, handler));

    const touchEvent = createTouchEvent(outsideElement);
    document.dispatchEvent(touchEvent);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(touchEvent);
  });

  test('should cleanup event listeners on unmount', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

    const { unmount } = renderHook(() => useClickOutside(ref, handler));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(2);
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function)
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function)
    );
  });

  test('should update when dependencies change', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    const ref = { current: document.createElement('div') };
    const outsideElement = document.createElement('button');

    const { rerender } = renderHook(
      ({ handler }) => useClickOutside(ref, handler),
      { initialProps: { handler: handler1 } }
    );

    const event1 = createMockEvent(outsideElement);
    document.dispatchEvent(event1);
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();

    rerender({ handler: handler2 });

    const event2 = createMockEvent(outsideElement);
    document.dispatchEvent(event2);
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  test('should handle null ref', () => {
    const handler = vi.fn();
    const ref = { current: null };
    const outsideElement = document.createElement('button');

    renderHook(() => useClickOutside(ref, handler));

    const event = createMockEvent(outsideElement);
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  test('should handle excludeRefs with null current', () => {
    const handler = vi.fn();
    const ref = { current: document.createElement('div') };
    const excludeRef = { current: null };
    const outsideElement = document.createElement('button');

    renderHook(() => useClickOutside(ref, handler, [excludeRef]));

    const event = createMockEvent(outsideElement);
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
