import Pagination from '@mui/material/Pagination';
import { useTranslation } from '@/shared/i18n/useTranslation';

const SINGLE_PAGE = 1;

export interface PaginationBarProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}

export const PaginationBar = ({ page, pageCount, onChange }: Readonly<PaginationBarProps>) => {
  const { t } = useTranslation();

  if (pageCount <= SINGLE_PAGE) return null;

  return (
    <nav aria-label={t('common.pagination')} className="mt-6 flex justify-center">
      <Pagination
        count={pageCount}
        page={page}
        onChange={(_, next) => onChange(next)}
        color="primary"
        shape="rounded"
      />
    </nav>
  );
};
