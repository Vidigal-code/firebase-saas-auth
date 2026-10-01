import CloseRounded from '@mui/icons-material/CloseRounded';
import MenuRounded from '@mui/icons-material/MenuRounded';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useState, type ReactNode } from 'react';
import { LanguageMenu } from '@/shared/i18n/LanguageMenu';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { ThemeModeToggle } from '@/shared/theme/ThemeModeToggle';

export type RenderMenuActions = (closeMenu: () => void) => ReactNode;

export interface NavigationDrawerProps {
  renderActions: RenderMenuActions;
}

interface PreferenceRowProps {
  label: string;
  children: ReactNode;
}

const PreferenceRow = ({ label, children }: Readonly<PreferenceRowProps>) => (
  <div className="flex items-center justify-between">
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    {children}
  </div>
);

// Hamburger navigation for small screens: preferences plus the actions of the current layout.
export const NavigationDrawer = ({ renderActions }: Readonly<NavigationDrawerProps>) => {
  const { t } = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const close = () => setOpen(false);
  const menuTitle = t('common.navigationMenu');

  return (
    <>
      <IconButton aria-label={t('common.openNavigation')} aria-expanded={isOpen} onClick={() => setOpen(true)}>
        <MenuRounded />
      </IconButton>
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={close}
        slotProps={{ paper: { role: 'dialog', 'aria-label': menuTitle, className: 'w-72 max-w-[85vw]' } }}
      >
        <nav className="flex flex-col gap-4 p-4 text-center">
          <div className="flex items-center justify-between">
            <Typography variant="subtitle1" component="p" className="font-bold">
              {menuTitle}
            </Typography>
            <IconButton aria-label={t('common.closeNavigation')} onClick={close}>
              <CloseRounded />
            </IconButton>
          </div>
          <div className="flex flex-col gap-2">{renderActions(close)}</div>
          <Divider />
          <PreferenceRow label={t('common.language')}>
            <LanguageMenu />
          </PreferenceRow>
          <PreferenceRow label={t('common.theme')}>
            <ThemeModeToggle />
          </PreferenceRow>
        </nav>
      </Drawer>
    </>
  );
};
