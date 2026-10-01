import type { ReactNode } from 'react';
import { usePagination } from '@/shared/hooks/usePagination';
import { PaginationBar } from './PaginationBar';

export interface PaginatedGridProps<T> {
  items: readonly T[];
  getKey: (item: T) => string;
  renderItem: (item: T) => ReactNode;
  empty: ReactNode;
}

export const PaginatedGrid = <T,>({ items, getKey, renderItem, empty }: Readonly<PaginatedGridProps<T>>) => {
  const { page, pageCount, pageItems, setPage } = usePagination(items);

  if (items.length === 0) return <>{empty}</>;

  return (
    <>
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((item) => (
          <li key={getKey(item)}>{renderItem(item)}</li>
        ))}
      </ul>
      <PaginationBar page={page} pageCount={pageCount} onChange={setPage} />
    </>
  );
};
