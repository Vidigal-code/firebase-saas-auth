import Button, { type ButtonProps } from '@mui/material/Button';
import { Link, Outlet } from 'react-router';
import { ROUTES } from '@/shared/config/routes';
import type { TranslationKey } from '@/shared/i18n/translate';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { Footer } from './Footer';
import { TopBar } from './TopBar';

interface AuthLink {
  to: string;
  labelKey: TranslationKey;
  desktopVariant: ButtonProps['variant'];
  mobileVariant: ButtonProps['variant'];
}

const AUTH_LINKS: readonly AuthLink[] = [
  { to: ROUTES.login, labelKey: 'common.login', desktopVariant: 'text', mobileVariant: 'outlined' },
  { to: ROUTES.register, labelKey: 'common.register', desktopVariant: 'contained', mobileVariant: 'contained' },
];

const DesktopAuthLinks = () => {
  const { t } = useTranslation();

  return AUTH_LINKS.map(({ to, labelKey, desktopVariant }) => (
    <Button key={to} component={Link} to={to} variant={desktopVariant}>
      {t(labelKey)}
    </Button>
  ));
};

const MobileAuthLinks = ({ closeMenu }: Readonly<{ closeMenu: () => void }>) => {
  const { t } = useTranslation();

  return AUTH_LINKS.map(({ to, labelKey, mobileVariant }) => (
    <Button key={to} component={Link} to={to} variant={mobileVariant} fullWidth onClick={closeMenu}>
      {t(labelKey)}
    </Button>
  ));
};

export const PublicLayout = () => (
  <div className="flex min-h-dvh flex-col bg-background-default">
    <TopBar
      homePath={ROUTES.home}
      desktopActions={<DesktopAuthLinks />}
      renderMobileActions={(closeMenu) => <MobileAuthLinks closeMenu={closeMenu} />}
    />
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:py-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);
