import Alert from '@mui/material/Alert';
import { useTranslation } from '@/shared/i18n/useTranslation';

export const LoadError = () => {
  const { t } = useTranslation();
  return <Alert severity="error">{t('common.loadError')}</Alert>;
};
