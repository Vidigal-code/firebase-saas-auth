import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from '@/shared/i18n/useTranslation';

export const PageLoader = () => {
  const { t } = useTranslation();

  return (
    <output className="flex min-h-[40vh] items-center justify-center">
      <CircularProgress aria-label={t('common.loading')} />
    </output>
  );
};
