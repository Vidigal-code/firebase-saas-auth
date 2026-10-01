import type { ReactNode } from 'react';
import { LanguageMenu } from '@/shared/i18n/LanguageMenu';
import { ThemeModeToggle } from '@/shared/theme/ThemeModeToggle';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { NavigationDrawer, type RenderMenuActions } from './NavigationDrawer';

export interface TopBarProps {
  homePath: string;
  desktopActions: ReactNode;
  renderMobileActions: RenderMenuActions;
}

// From the md breakpoint the actions sit inline; below it they move into the hamburger menu.
export const TopBar = ({ homePath, desktopActions, renderMobileActions }: Readonly<TopBarProps>) => (
  <header className="sticky top-0 z-30 border-b border-divider bg-background-paper/90 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4">
      <BrandLogo to={homePath} />
      <div className="hidden items-center gap-2 md:flex">
        <LanguageMenu />
        <ThemeModeToggle />
        {desktopActions}
      </div>
      <div className="md:hidden">
        <NavigationDrawer renderActions={renderMobileActions} />
      </div>
    </div>
  </header>
);
