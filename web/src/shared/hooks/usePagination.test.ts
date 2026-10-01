import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { usePagination } from './usePagination';

const PAGE_SIZE = 3;
const ITEMS = Array.from({ length: 7 }, (_, index) => index + 1);

describe('usePagination', () => {
  it('slices the first page', () => {
    const { result } = renderHook(() => usePagination(ITEMS, PAGE_SIZE));

    expect(result.current.pageItems).toEqual([1, 2, 3]);
    expect(result.current.pageCount).toBe(3);
  });

  it('moves to the requested page', () => {
    const { result } = renderHook(() => usePagination(ITEMS, PAGE_SIZE));

    act(() => result.current.setPage(3));

    expect(result.current.pageItems).toEqual([7]);
  });

  it('clamps the page when the list shrinks in real time', () => {
    const { result, rerender } = renderHook(({ items }) => usePagination(items, PAGE_SIZE), {
      initialProps: { items: ITEMS },
    });
    act(() => result.current.setPage(3));

    rerender({ items: ITEMS.slice(0, 4) });

    expect(result.current.page).toBe(2);
    expect(result.current.pageItems).toEqual([4]);
  });

  it('reports a single page for an empty list', () => {
    const { result } = renderHook(() => usePagination([], PAGE_SIZE));

    expect(result.current.pageCount).toBe(1);
    expect(result.current.pageItems).toEqual([]);
  });
});
