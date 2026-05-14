import { Box, Typography } from '@mui/material';
import { BRAND } from '@/shared/constants/theme';

export const Footer = () => (
  <Box
    component="footer"
    sx={{
      borderTop: '1px solid',
      borderColor: 'divider',
      bgcolor: 'background.paper',
      py: 1.5,
      px: { xs: 2, md: 3 },
      display: 'flex',
      alignItems: 'center',
      justifyContent: { xs: 'center', md: 'space-between' },
      flexWrap: 'wrap',
      gap: 0.5,
      flexShrink: 0,
    }}
  >
    <Typography variant="caption" color="text.secondary">
      {'Criador '}
      <Box
        component="a"
        href={BRAND.authorUrl}
        target="_blank"
        rel="noopener noreferrer"
        sx={{ color: 'primary.main', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
      >
        {BRAND.author}
      </Box>
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {`${BRAND.name} © ${new Date().getFullYear()}`}
    </Typography>
  </Box>
);
