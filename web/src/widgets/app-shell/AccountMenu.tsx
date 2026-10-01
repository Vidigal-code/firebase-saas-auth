import LockOutlined from '@mui/icons-material/LockOutlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState, type MouseEvent } from 'react';
import { useCurrentUser } from '@/entities/session/useSession';
import { signOut } from '@/features/auth/model/authService';
import { useTranslation } from '@/shared/i18n/useTranslation';

const INITIALS_LENGTH = 2;
const UNKNOWN_INITIALS = '?';

export interface AccountActionsProps {
  onChangePassword: () => void;
}

export interface AccountDrawerActionsProps extends AccountActionsProps {
  closeMenu: () => void;
}

const toInitials = (email: string | null) => (email ?? UNKNOWN_INITIALS).slice(0, INITIALS_LENGTH).toUpperCase();

const logout = () => void signOut();

const closingWith = (closeMenu: () => void, action: () => void) => () => {
  closeMenu();
  action();
};

const AccountSummary = () => {
  const { email } = useCurrentUser();
  const { t } = useTranslation();

  return (
    <div className="min-w-0">
      <Typography variant="caption" color="text.secondary" className="font-bold uppercase">
        {t('common.account')}
      </Typography>
      <Typography variant="body2" className="truncate font-semibold">
        {email}
      </Typography>
    </div>
  );
};

// Desktop: avatar button with a dropdown menu.
export const AccountMenu = ({ onChangePassword }: Readonly<AccountActionsProps>) => {
  const { email } = useCurrentUser();
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const openMenu = (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget);
  const closeMenu = () => setAnchor(null);

  return (
    <>
      <IconButton aria-label={t('common.openMenu')} aria-haspopup="menu" onClick={openMenu} size="small">
        <Avatar className="brand-gradient size-8 text-xs font-bold text-white">{toInitials(email)}</Avatar>
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={closeMenu}>
        <div className="max-w-64 px-4 py-2">
          <AccountSummary />
        </div>
        <Divider />
        <MenuItem onClick={closingWith(closeMenu, onChangePassword)}>
          <ListItemIcon>
            <LockOutlined fontSize="small" />
          </ListItemIcon>
          {t('common.changePassword')}
        </MenuItem>
        <MenuItem onClick={closingWith(closeMenu, logout)} className="text-error">
          <ListItemIcon className="text-error">
            <LogoutOutlined fontSize="small" />
          </ListItemIcon>
          {t('common.logout')}
        </MenuItem>
      </Menu>
    </>
  );
};

// Mobile: the same actions as full-width buttons inside the navigation drawer.
export const AccountDrawerActions = ({ onChangePassword, closeMenu }: Readonly<AccountDrawerActionsProps>) => {
  const { t } = useTranslation();

  return (
    <>
      <AccountSummary />
      <Button
        variant="outlined"
        fullWidth
        startIcon={<LockOutlined />}
        onClick={closingWith(closeMenu, onChangePassword)}
      >
        {t('common.changePassword')}
      </Button>
      <Button
        variant="outlined"
        color="error"
        fullWidth
        startIcon={<LogoutOutlined />}
        onClick={closingWith(closeMenu, logout)}
      >
        {t('common.logout')}
      </Button>
    </>
  );
};
