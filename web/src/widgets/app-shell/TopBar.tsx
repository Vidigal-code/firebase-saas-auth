import type { ReactNode } from 'react';
import { LanguageMenu } from '@/shared/i18n/LanguageMenu';
import { ThemeModeToggle } from '@/shared/theme/ThemeModeToggle';
import { BrandLogo } from '@/shared/ui/BrandLogo';

export interface TopBarProps {
  homePath: string;
  children?: ReactNode;
}

export const TopBar = ({ homePath, children }: Readonly<TopBarProps>) => (
  <header className="sticky top-0 z-30 border-b border-divider bg-background-paper/90 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
      <BrandLogo to={homePath} />
      <div className="flex-1" />
      <LanguageMenu />
      <ThemeModeToggle />
      {children}
    </div>
  </header>
);
