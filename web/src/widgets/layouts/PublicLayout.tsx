import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Button, Drawer, Typography } from '@mui/material';
import { FiMenu, FiX } from 'react-icons/fi';
import { useLang } from '@/shared/hooks/useLang';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { LangSelector, ThemeToggleButton, LangThemeBar } from '@/shared/ui/LangSelector';
import { Footer } from './ui/Footer';
import { LAYOUT } from '@/shared/constants/theme';

const AUTH_PATHS = ['/login', '/register'];

const DrawerCloseHeader = ({ onClose }: { onClose: () => void }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 2, py: 1, minHeight: 48, borderBottom: '1px solid', borderColor: 'divider' }}>
    <IconButton onClick={onClose} size="small">
      <FiX size={16} />
    </IconButton>
  </Box>
);

interface AuthButtonsProps {
  onLogin: () => void;
  onRegister: () => void;
  loginLabel: string;
  registerLabel: string;
}

const DesktopAuthButtons = ({ onLogin, onRegister, loginLabel, registerLabel }: AuthButtonsProps) => (
  <>
    <Button variant="text" size="small" onClick={onLogin} sx={{ fontSize: '0.8rem' }}>
      {loginLabel}
    </Button>
    <Button variant="contained" size="small" onClick={onRegister} sx={{ fontSize: '0.8rem' }}>
      {registerLabel}
    </Button>
  </>
);

interface DrawerAuthButtonsProps extends AuthButtonsProps {
  menuLabel: string;
}

const DrawerAuthButtons = ({ onLogin, onRegister, menuLabel, loginLabel, registerLabel }: DrawerAuthButtonsProps) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.05em', mb: 1, display: 'block' }}>
      {menuLabel}
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Button fullWidth variant="outlined" onClick={onLogin}>
        {loginLabel}
      </Button>
      <Button fullWidth variant="contained" onClick={onRegister}>
        {registerLabel}
      </Button>
    </Box>
  </Box>
);

interface PublicHeaderProps {
  showAuthButtons?: boolean;
}

const PublicHeader = ({ showAuthButtons = true }: PublicHeaderProps) => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  const handleNavigate = (path: string) => {
    navigate(path);
    closeDrawer();
  };

  return (
    <>
      <Box
        component="header"
        sx={{
          height: LAYOUT.headerHeight,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          px: { xs: 1.5, md: 3 },
          gap: 1,
          position: 'sticky',
          top: 0,
          zIndex: 30,
          flexShrink: 0,
        }}
      >
        <Box onClick={() => navigate('/')} sx={{ cursor: 'pointer', flexShrink: 0 }}>
          <BrandLogo size="sm" />
        </Box>

        <Box sx={{ flex: 1 }} />

        {showAuthButtons && (
          <>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.75 }}>
              <LangSelector />
              <ThemeToggleButton />
              <DesktopAuthButtons
                onLogin={() => navigate('/login')}
                onRegister={() => navigate('/register')}
                loginLabel={t.common.login}
                registerLabel={t.common.register}
              />
            </Box>

            <IconButton
              onClick={() => setDrawerOpen(true)}
              size="small"
              sx={{
                display: { xs: 'flex', sm: 'none' },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: `${LAYOUT.borderRadiusSm}px`,
              }}
            >
              <FiMenu size={16} />
            </IconButton>
          </>
        )}
      </Box>

      {showAuthButtons && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={closeDrawer}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              width: 260,
              bgcolor: 'background.paper',
              border: 'none',
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <DrawerCloseHeader onClose={closeDrawer} />

            <Box sx={{ px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DrawerAuthButtons
                onLogin={() => handleNavigate('/login')}
                onRegister={() => handleNavigate('/register')}
                menuLabel={t.common.menu}
                loginLabel={t.common.login}
                registerLabel={t.common.register}
              />
              <LangThemeBar />
            </Box>
          </Box>
        </Drawer>
      )}
    </>
  );
};

interface PublicLayoutProps {
  hideAuthButtons?: boolean;
}

export const PublicLayout = ({ hideAuthButtons }: PublicLayoutProps) => {
  const location = useLocation();
  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <PublicHeader showAuthButtons={!hideAuthButtons} />

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          ...(isAuthPage
            ? { alignItems: 'center', justifyContent: 'center', px: 2, py: 3 }
            : { width: '100%', maxWidth: LAYOUT.maxContentWidth, mx: 'auto', px: { xs: 2, md: 3 }, py: { xs: 2, md: 4 } }
          ),
        }}
      >
        {isAuthPage ? (
          <Box
            sx={{
              width: '100%',
              maxWidth: 380,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: `${LAYOUT.borderRadius}px`,
              p: { xs: 2.5, sm: 3.5 },
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            <Outlet />
          </Box>
        ) : (
          <Outlet />
        )}
      </Box>

      <Footer />
    </Box>
  );
};
