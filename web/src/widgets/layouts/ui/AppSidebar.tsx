import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { FiLink } from 'react-icons/fi';
import { BrandLogo } from '@/shared/ui/BrandLogo';
import type { ReactNode } from 'react';

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Conexoes', path: '/connections', icon: <FiLink /> },
];

const SECTION_LABEL = 'MENU';

interface SidebarNavItemProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

const SidebarNavItem = ({ item, isActive, onClick }: SidebarNavItemProps) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      px: 2,
      py: 1,
      mx: 1.5,
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: isActive ? 700 : 500,
      fontSize: '0.85rem',
      color: isActive ? 'primary.main' : 'text.secondary',
      bgcolor: isActive ? 'action.selected' : 'transparent',
      transition: 'all 0.15s ease',
      '&:hover': {
        bgcolor: isActive ? 'action.selected' : 'action.hover',
        color: isActive ? 'primary.main' : 'text.primary',
      },
    }}
  >
    <Box sx={{ fontSize: 17, display: 'flex', flexShrink: 0 }}>{item.icon}</Box>
    <Box component="span">{item.label}</Box>
  </Box>
);

interface AppSidebarProps {
  onNavigate?: () => void;
}

export const AppSidebar = ({ onNavigate }: AppSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const isItemActive = (item: NavItem) =>
    location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: { lg: '1px solid' },
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Box
        onClick={() => handleNav('/connections')}
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 2.5,
          minHeight: 56,
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
          cursor: 'pointer',
        }}
      >
        <BrandLogo size="md" />
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', pt: 2, pb: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 700, px: 3, mb: 1, display: 'block', letterSpacing: '0.08em' }}
        >
          {SECTION_LABEL}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {NAV_ITEMS.map(item => (
            <SidebarNavItem
              key={item.label}
              item={item}
              isActive={isItemActive(item)}
              onClick={() => handleNav(item.path)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
