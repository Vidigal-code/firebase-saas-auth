import { CircularProgress, Box } from '@mui/material';

interface Props { minHeight?: string }

export const PageLoader = ({ minHeight = '200px' }: Props) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight }}>
    <CircularProgress size={32} />
  </Box>
);
