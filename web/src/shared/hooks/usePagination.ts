import { useState, useMemo, useCallback } from 'react';

const DEFAULT_PAGE_SIZE = 6;

interface PaginationResult<T> {
  page: number;
  pageCount: number;
  pageItems: T[];
  hasPagination: boolean;
  goToPage: (event: unknown, value: number) => void;
  goNext: () => void;
  goPrev: () => void;
}

export const usePagination = <T>(items: T[], pageSize = DEFAULT_PAGE_SIZE): PaginationResult<T> => {
  const [page, setPage] = useState(1);

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(items.length / pageSize)),
    [items.length, pageSize],
  );

  const safePage = useMemo(
    () => Math.min(page, pageCount),
    [page, pageCount],
  );

  const pageItems = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, safePage, pageSize]);

  const hasPagination = items.length > pageSize;

  const goToPage = useCallback(
    (_: unknown, value: number) => setPage(value),
    [],
  );

  const goNext = useCallback(
    () => setPage(p => Math.min(p + 1, pageCount)),
    [pageCount],
  );

  const goPrev = useCallback(
    () => setPage(p => Math.max(p - 1, 1)),
    [],
  );

  return { page: safePage, pageCount, pageItems, hasPagination, goToPage, goNext, goPrev };
};
