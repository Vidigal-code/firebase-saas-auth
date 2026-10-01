import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAsyncAction } from './useAsyncAction';

describe('useAsyncAction', () => {
  it('returns the value of a successful action', async () => {
    const { result } = renderHook(() => useAsyncAction((value: number) => Promise.resolve(value * 2)));

    let outcome: Awaited<ReturnType<typeof result.current.run>> | undefined;
    await act(async () => {
      outcome = await result.current.run(21);
    });

    expect(outcome).toEqual({ ok: true, value: 42 });
    expect(result.current.error).toBeNull();
    expect(result.current.isPending).toBe(false);
  });

  it('captures failures instead of throwing', async () => {
    const failure = new Error('permission-denied');
    const { result } = renderHook(() => useAsyncAction(() => Promise.reject(failure)));

    let outcome: Awaited<ReturnType<typeof result.current.run>> | undefined;
    await act(async () => {
      outcome = await result.current.run();
    });

    expect(outcome).toEqual({ ok: false, error: failure });
    expect(result.current.error).toBe(failure);
  });

  it('clears a previous error on reset', async () => {
    const { result } = renderHook(() => useAsyncAction(() => Promise.reject(new Error('boom'))));
    await act(async () => {
      await result.current.run();
    });

    act(() => result.current.reset());

    expect(result.current.error).toBeNull();
  });
});
