import { Outlet } from 'react-router';
import { ROUTES } from '@/shared/config/routes';
import { AccountMenu } from './AccountMenu';
import { Footer } from './Footer';
import { TopBar } from './TopBar';

export const DashboardLayout = () => (
  <div className="flex min-h-dvh flex-col bg-background-default">
    <TopBar homePath={ROUTES.connections}>
      <AccountMenu />
    </TopBar>
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);
