import LockOutlined from '@mui/icons-material/LockOutlined';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState, type MouseEvent } from 'react';
import { useCurrentUser } from '@/entities/session/useSession';
import { signOut } from '@/features/auth/model/authService';
import { ChangePasswordDialog } from '@/features/auth/ui/ChangePasswordDialog';
import { useTranslation } from '@/shared/i18n/useTranslation';

const INITIALS_LENGTH = 2;

export const AccountMenu = () => {
  const { email } = useCurrentUser();
  const { t } = useTranslation();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);

  const openMenu = (event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget);
  const closeMenu = () => setAnchor(null);

  const openPasswordDialog = () => {
    closeMenu();
    setPasswordDialogOpen(true);
  };

  const logout = () => {
    closeMenu();
    void signOut();
  };

  return (
    <>
      <IconButton aria-label={t('common.openMenu')} aria-haspopup="menu" onClick={openMenu} size="small">
        <Avatar className="brand-gradient size-8 text-xs font-bold text-white">
          {(email ?? '?').slice(0, INITIALS_LENGTH).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={closeMenu}>
        <div className="max-w-64 px-4 py-2">
          <Typography variant="caption" color="text.secondary" className="font-bold uppercase">
            {t('common.account')}
          </Typography>
          <Typography variant="body2" className="truncate font-semibold">
            {email}
          </Typography>
        </div>
        <Divider />
        <MenuItem onClick={openPasswordDialog}>
          <ListItemIcon>
            <LockOutlined fontSize="small" />
          </ListItemIcon>
          {t('common.changePassword')}
        </MenuItem>
        <MenuItem onClick={logout} className="text-error">
          <ListItemIcon className="text-error">
            <LogoutOutlined fontSize="small" />
          </ListItemIcon>
          {t('common.logout')}
        </MenuItem>
      </Menu>
      {isPasswordDialogOpen && <ChangePasswordDialog onClose={() => setPasswordDialogOpen(false)} />}
    </>
  );
};
