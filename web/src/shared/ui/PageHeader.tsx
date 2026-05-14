import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export const PageHeader = ({ title, subtitle, icon, action }: Props) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      justifyContent: 'space-between',
      alignItems: { xs: 'stretch', sm: 'flex-start' },
      gap: 2,
      mb: 3,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
      {icon && (
        <Box
          sx={{
            p: 1,
            borderRadius: '8px',
            backgroundColor: 'primary.main',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            lineHeight: 1.2,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
    {action && (
      <Box sx={{ flexShrink: 0, display: 'flex', width: { xs: '100%', sm: 'auto' } }}>
        {action}
      </Box>
    )}
  </Box>
);
