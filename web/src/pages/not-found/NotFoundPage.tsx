import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router';
import { ROUTES } from '@/shared/config/routes';
import { useTranslation } from '@/shared/i18n/useTranslation';

export const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
      <Typography variant="h1" component="p" className="brand-gradient-text text-8xl font-black" aria-hidden>
        {t('notFound.code')}
      </Typography>
      <Typography variant="h5" component="h1" className="font-bold">
        {t('notFound.title')}
      </Typography>
      <Typography color="text.secondary">{t('notFound.description')}</Typography>
      <Button component={Link} to={ROUTES.home} variant="contained">
        {t('notFound.back')}
      </Button>
    </div>
  );
};
