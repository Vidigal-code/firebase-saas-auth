import { Box, Typography } from '@mui/material';
import { FiZap } from 'react-icons/fi';
import { BRAND } from '@/shared/constants/theme';

export const BrandLogo = ({ size = 'md' }: { size?: 'sm' | 'md' }) => {
  const iconBox = size === 'sm' ? 28 : 36;
  const iconFont = size === 'sm' ? 14 : 18;
  const textVariant = size === 'sm' ? 'subtitle2' : 'subtitle1';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', flexShrink: 0 }}>
      <Box
        sx={{
          width: iconBox, height: iconBox,
          borderRadius: '10px',
          background: BRAND.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: iconFont,
          boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
        }}
      >
        <FiZap />
      </Box>
      <Typography
        variant={textVariant}
        sx={{
          fontWeight: 800,
          background: BRAND.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {BRAND.name}
      </Typography>
    </Box>
  );
};
