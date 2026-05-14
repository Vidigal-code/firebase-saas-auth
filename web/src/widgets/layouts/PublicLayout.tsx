import { useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, IconButton, Button, Tooltip } from '@mui/material';
import { FiSun, FiMoon } from 'react-icons/fi';
import { ThemeModeContext } from '@/app/providers';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import { Footer } from './ui/Footer';
import { LAYOUT } from '@/shared/constants/theme';

const AUTH_PATHS = ['/login', '/register'];

const PublicHeader = () => {
  const { mode, toggleColorMode } = useContext(ThemeModeContext);
  const navigate = useNavigate();

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
        px: { xs: 2, md: 3 },
        gap: 2,
        position: 'sticky',
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      <Box onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
        <BrandLogo size="sm" />
      </Box>

      <Box sx={{ flex: 1 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Tooltip title={mode === 'dark' ? 'Modo Claro' : 'Modo Escuro'}>
          <IconButton
            onClick={toggleColorMode}
            size="small"
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: `${LAYOUT.borderRadiusSm}px` }}
          >
            {mode === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
          </IconButton>
        </Tooltip>
        <Button variant="text" size="small" onClick={() => navigate('/login')} sx={{ fontSize: '0.8rem' }}>
          Entrar
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate('/register')}
          sx={{ fontSize: '0.8rem', display: { xs: 'none', sm: 'inline-flex' } }}
        >
          Cadastrar
        </Button>
      </Box>
    </Box>
  );
};

export const PublicLayout = () => {
  const location = useLocation();
  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <PublicHeader />

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
