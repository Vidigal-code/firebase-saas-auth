import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface Props { icon?: ReactNode; message: string }

export const EmptyState = ({ icon, message }: Props) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2, color: 'text.secondary' }}>
    {icon && <Box sx={{ fontSize: 48, opacity: 0.4 }}>{icon}</Box>}
    <Typography variant="body1" color="text.secondary">{message}</Typography>
  </Box>
);
