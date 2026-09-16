// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCopy } from './useCopy';

/**
 * Regression guard. The first implementation swallowed a clipboard rejection in an empty
 * handler, so a blocked copy looked exactly like a successful one — the worst outcome for a
 * participant mid-exercise. These tests exist to make sure it can never go quiet again.
 */
describe('useCopy', () => {
  const originalClipboard = navigator.clipboard;

  const setClipboard = (impl: unknown) =>
    Object.defineProperty(navigator, 'clipboard', { value: impl, configurable: true });

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    setClipboard(originalClipboard);
  });

  it('reports success when the Clipboard API resolves', async () => {
    setClipboard({ writeText: vi.fn().mockResolvedValue(undefined) });
    const { result } = renderHook(() => useCopy());

    await act(async () => {
      result.current.copy('פרומפט');
    });
    expect(result.current.state).toBe('copied');
  });

  it('falls back to execCommand when the Clipboard API rejects, and still reports success', async () => {
    setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('NotAllowedError')) });
    const exec = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, 'execCommand', { value: exec, configurable: true });

    const { result } = renderHook(() => useCopy());
    await act(async () => {
      result.current.copy('פרומפט');
    });

    expect(exec).toHaveBeenCalledWith('copy');
    expect(result.current.state).toBe('copied');
  });

  it('REPORTS FAILURE when every mechanism is blocked — never silently succeeds', async () => {
    setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('NotAllowedError')) });
    Object.defineProperty(document, 'execCommand', {
      value: vi.fn().mockReturnValue(false),
      configurable: true,
    });

    const { result } = renderHook(() => useCopy());
    await act(async () => {
      result.current.copy('פרומפט');
    });
    expect(result.current.state).toBe('failed');
  });

  it('selects the text on failure so the participant can copy it by hand', async () => {
    setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('no')) });
    Object.defineProperty(document, 'execCommand', {
      value: vi.fn().mockReturnValue(false),
      configurable: true,
    });
    const el = document.createElement('p');
    el.textContent = 'אתה מנהל קשרי קהילה ברשות מקומית.';
    document.body.appendChild(el);

    const { result } = renderHook(() => useCopy());
    await act(async () => {
      result.current.copy(el.textContent!, el);
    });

    expect(String(window.getSelection())).toContain('קשרי קהילה');
    el.remove();
  });

  it('holds the failure message longer than the success one — it asks the reader to act', async () => {
    setClipboard({ writeText: vi.fn().mockRejectedValue(new Error('no')) });
    Object.defineProperty(document, 'execCommand', {
      value: vi.fn().mockReturnValue(false),
      configurable: true,
    });

    const { result } = renderHook(() => useCopy());
    await act(async () => {
      result.current.copy('פרומפט');
    });
    expect(result.current.state).toBe('failed');

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.state).toBe('failed'); // a success toast would already be gone

    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(result.current.state).toBe('idle');
  });
});
