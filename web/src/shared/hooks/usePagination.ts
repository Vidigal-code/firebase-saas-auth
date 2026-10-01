import { useState } from 'react';

export const DEFAULT_PAGE_SIZE = 9;
const FIRST_PAGE = 1;

export interface Pagination<T> {
  page: number;
  pageCount: number;
  pageItems: T[];
  setPage: (page: number) => void;
}

export const usePagination = <T>(items: readonly T[], pageSize = DEFAULT_PAGE_SIZE): Pagination<T> => {
  const [requestedPage, setRequestedPage] = useState(FIRST_PAGE);

  const pageCount = Math.max(FIRST_PAGE, Math.ceil(items.length / pageSize));
  const page = Math.min(requestedPage, pageCount);
  const start = (page - FIRST_PAGE) * pageSize;

  return { page, pageCount, pageItems: items.slice(start, start + pageSize), setPage: setRequestedPage };
};
