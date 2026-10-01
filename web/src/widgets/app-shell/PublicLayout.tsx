import Button from '@mui/material/Button';
import { Link, Outlet } from 'react-router';
import { ROUTES } from '@/shared/config/routes';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { Footer } from './Footer';
import { TopBar } from './TopBar';

export const PublicLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-dvh flex-col bg-background-default">
      <TopBar homePath={ROUTES.home}>
        <Button component={Link} to={ROUTES.login} className="hidden sm:inline-flex">
          {t('common.login')}
        </Button>
        <Button component={Link} to={ROUTES.register} variant="contained">
          {t('common.register')}
        </Button>
      </TopBar>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
