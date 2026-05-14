import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi';
import { useLang } from '@/shared/hooks/useLang';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { BRAND, LAYOUT } from '@/shared/constants/theme';

const HOME_PATH = '/';
const DASHBOARD_PATH = '/connections';

const GradientCode = ({ code }: { code: string }) => (
  <Typography
    variant="h1"
    sx={{
      fontWeight: 900,
      fontSize: { xs: '6rem', sm: '8rem', md: '10rem' },
      lineHeight: 1,
      background: BRAND.gradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      userSelect: 'none',
    }}
  >
    {code}
  </Typography>
);

const ErrorIcon = () => (
  <Box
    sx={{
      width: 56,
      height: 56,
      borderRadius: `${LAYOUT.borderRadius}px`,
      background: BRAND.gradient,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 28,
    }}
  >
    <FiAlertCircle />
  </Box>
);

const useRedirectPath = () => {
  const { isAuthenticated } = useCurrentUser();
  return isAuthenticated ? DASHBOARD_PATH : HOME_PATH;
};

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const redirectPath = useRedirectPath();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flex: 1,
        py: { xs: 4, md: 8 },
        px: 2,
        gap: 2,
      }}
    >
      <ErrorIcon />
      <GradientCode code={t.notFound.code} />

      <Typography
        variant="h5"
        sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}
      >
        {t.notFound.title}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 400, lineHeight: 1.7, fontSize: { xs: '0.85rem', sm: '0.95rem' } }}
      >
        {t.notFound.description}
      </Typography>

      <Button
        variant="contained"
        size="large"
        startIcon={<FiArrowLeft />}
        onClick={() => navigate(redirectPath)}
        sx={{
          borderRadius: '999px',
          px: 4,
          fontWeight: 700,
          fontSize: '0.9rem',
          mt: 1,
        }}
      >
        {t.notFound.backHome}
      </Button>
    </Box>
  );
};
