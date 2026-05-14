import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, IconButton, Tooltip, Avatar, Menu, MenuItem,
  ListItemIcon, Divider, Typography,
} from '@mui/material';
import { FiSun, FiMoon, FiLogOut, FiLock, FiMenu } from 'react-icons/fi';
import { ThemeModeContext } from '@/app/providers';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { LAYOUT, BRAND } from '@/shared/constants/theme';

interface AppHeaderProps {
  onDrawerToggle: () => void;
  onOpenPasswordDialog: () => void;
  onLogout: () => void;
}

const ThemeToggle = () => {
  const { mode, toggleColorMode } = useContext(ThemeModeContext);
  return (
    <Tooltip title={mode === 'dark' ? 'Modo Claro' : 'Modo Escuro'}>
      <IconButton
        onClick={toggleColorMode}
        size="small"
        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: `${LAYOUT.borderRadiusSm}px` }}
      >
        {mode === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
      </IconButton>
    </Tooltip>
  );
};

const UserAvatar = ({ email }: { email: string }) => (
  <Avatar
    sx={{
      width: 30, height: 30, fontSize: '0.7rem',
      background: BRAND.gradient,
    }}
  >
    {email ? email.slice(0, 2).toUpperCase() : 'U'}
  </Avatar>
);

export const AppHeader = ({ onDrawerToggle, onOpenPasswordDialog, onLogout }: AppHeaderProps) => {
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const openMenu  = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);
  const onPassword = () => { closeMenu(); onOpenPasswordDialog(); };
  const onLogoutClick = () => { closeMenu(); onLogout(); };

  return (
    <Box
      component="header"
      sx={{
        height: LAYOUT.headerHeight,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 1.5, sm: 2 },
        gap: 1,
        position: 'sticky',
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      <IconButton
        onClick={onDrawerToggle}
        size="small"
        sx={{
          display: { lg: 'none' },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: `${LAYOUT.borderRadiusSm}px`,
        }}
      >
        <FiMenu size={16} />
      </IconButton>

      <Box onClick={() => navigate('/connections')} sx={{ display: { xs: 'flex', lg: 'none' }, cursor: 'pointer' }}>
        <BrandLogo size="sm" />
      </Box>

      <Box sx={{ flex: 1 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <ThemeToggle />

        <Box
          onClick={openMenu}
          sx={{
            display: 'flex', alignItems: 'center', gap: 0.75,
            cursor: 'pointer', borderRadius: `${LAYOUT.borderRadiusSm}px`,
            px: 0.75, py: 0.5,
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <UserAvatar email={user?.email ?? ''} />
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: { mt: 1, minWidth: 190, borderRadius: `${LAYOUT.borderRadius}px`, border: '1px solid', borderColor: 'divider' },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', letterSpacing: '0.05em' }}>
            CONTA
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={onPassword} sx={{ gap: 1.5, py: 1 }}>
          <ListItemIcon sx={{ minWidth: 'unset' }}><FiLock size={15} /></ListItemIcon>
          Alterar Senha
        </MenuItem>
        <MenuItem onClick={onLogoutClick} sx={{ gap: 1.5, py: 1, color: 'error.main' }}>
          <ListItemIcon sx={{ minWidth: 'unset', color: 'error.main' }}><FiLogOut size={15} /></ListItemIcon>
          Sair
        </MenuItem>
      </Menu>
    </Box>
  );
};
