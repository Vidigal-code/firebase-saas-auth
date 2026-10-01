import { useState } from 'react';
import { Outlet } from 'react-router';
import { ChangePasswordDialog } from '@/features/auth/ui/ChangePasswordDialog';
import { ROUTES } from '@/shared/config/routes';
import { AccountDrawerActions, AccountMenu } from './AccountMenu';
import { Footer } from './Footer';
import { TopBar } from './TopBar';

export const DashboardLayout = () => {
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const openPasswordDialog = () => setPasswordDialogOpen(true);
  const closePasswordDialog = () => setPasswordDialogOpen(false);

  return (
    <div className="flex min-h-dvh flex-col bg-background-default">
      <TopBar
        homePath={ROUTES.connections}
        desktopActions={<AccountMenu onChangePassword={openPasswordDialog} />}
        renderMobileActions={(closeMenu) => (
          <AccountDrawerActions onChangePassword={openPasswordDialog} closeMenu={closeMenu} />
        )}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
      {isPasswordDialogOpen && <ChangePasswordDialog onClose={closePasswordDialog} />}
    </div>
  );
};
