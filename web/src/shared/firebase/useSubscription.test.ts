import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useSubscription, type Subscribe } from './useSubscription';

const STATES = { idle: 'idle', loading: 'loading' };

const createFakeSource = () => {
  let emit: (value: string) => void = () => undefined;
  const unsubscribe = vi.fn();
  const subscribe: Subscribe<string, string> = (_source, nextEmit) => {
    emit = nextEmit;
    return unsubscribe;
  };
  return { subscribe, unsubscribe, emit: (value: string) => emit(value) };
};

describe('useSubscription', () => {
  it('is idle without a source', () => {
    const { subscribe } = createFakeSource();
    const { result } = renderHook(() => useSubscription(null, subscribe, STATES));

    expect(result.current).toBe('idle');
  });

  it('is loading until the first snapshot, then follows updates', () => {
    const fake = createFakeSource();
    const { result } = renderHook(() => useSubscription('query-a', fake.subscribe, STATES));
    expect(result.current).toBe('loading');

    act(() => fake.emit('first'));
    expect(result.current).toBe('first');

    act(() => fake.emit('second'));
    expect(result.current).toBe('second');
  });

  it('never shows data of a previous source and unsubscribes from it', () => {
    const fake = createFakeSource();
    const { result, rerender } = renderHook(({ source }) => useSubscription(source, fake.subscribe, STATES), {
      initialProps: { source: 'query-a' },
    });
    act(() => fake.emit('data of a'));

    rerender({ source: 'query-b' });

    expect(result.current).toBe('loading');
    expect(fake.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
