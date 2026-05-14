import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Drawer, Box } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '@/shared/config/firebase';
import { AppSidebar } from './ui/AppSidebar';
import { AppHeader } from './ui/AppHeader';
import { Footer } from './ui/Footer';
import { UpdatePasswordDialog } from '@/features/auth/ui/UpdatePasswordDialog';
import { LAYOUT } from '@/shared/constants/theme';

const SW = LAYOUT.sidebarWidth;

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const toggleDrawer = () => setMobileOpen(v => !v);
  const closeDrawer  = () => setMobileOpen(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        component="nav"
        sx={{
          width: SW,
          flexShrink: 0,
          display: { xs: 'none', lg: 'block' },
        }}
      >
        <Box
          sx={{
            width: SW,
            height: '100vh',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 40,
          }}
        >
          <AppSidebar />
        </Box>
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={closeDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: SW,
            border: 'none',
            bgcolor: 'background.paper',
          },
        }}
      >
        <AppSidebar onNavigate={closeDrawer} />
      </Drawer>

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <AppHeader
          onDrawerToggle={toggleDrawer}
          onOpenPasswordDialog={() => setPasswordOpen(true)}
          onLogout={handleLogout}
        />

        <Box
          sx={{
            flex: 1,
            px: { xs: 1.5, sm: 2, md: 3 },
            py: { xs: 2, md: 3 },
            maxWidth: LAYOUT.maxContentWidth,
            width: '100%',
            mx: 'auto',
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Box>

        <Footer />
      </Box>

      <UpdatePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)} />
    </Box>
  );
};
