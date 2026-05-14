import { Typography, Button, Box, Chip, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers, FiMessageSquare, FiClock, FiShield, FiSmartphone, FiCheckCircle, FiArrowRight, FiZap,
} from 'react-icons/fi';
import { BRAND, LAYOUT } from '@/shared/constants/theme';
import { useLang } from '@/shared/hooks/useLang';
import type { ReactNode } from 'react';

interface Feature { title: string; description: string; icon: ReactNode; badge?: string }
interface Stat    { label: string; value: string }

const FEATURE_ICONS: ReactNode[] = [
  <FiUsers />, <FiSmartphone />, <FiMessageSquare />, <FiClock />, <FiShield />, <FiCheckCircle />,
];

const FEATURE_KEYS = ['connections', 'contacts', 'broadcast', 'scheduling', 'security', 'realtime'] as const;
const STAT_KEYS = ['connections', 'latency', 'isolation', 'uptime'] as const;

const FeatureCard = ({ feature }: { feature: Feature }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    {feature.badge && (
      <Chip label={feature.badge} color="primary" size="small" sx={{ position: 'absolute', top: -10, right: 16, fontWeight: 700, fontSize: '0.65rem' }} />
    )}
    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ width: 40, height: 40, borderRadius: `${LAYOUT.borderRadiusSm}px`, background: BRAND.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18, mb: 1.5 }}>
        {feature.icon}
      </Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>{feature.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
        {feature.description}
      </Typography>
    </CardContent>
  </Card>
);

const StatItem = ({ stat, index, total }: { stat: Stat; index: number; total: number }) => (
  <Box
    sx={{
      p: { xs: 2, sm: 3 },
      textAlign: 'center',
      borderRight: { md: index < total - 1 ? '1px solid' : 'none' },
      borderBottom: { xs: index < total - 2 ? '1px solid' : 'none', md: 'none' },
      borderColor: 'divider',
    }}
  >
    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.2rem' } }}>
      {stat.value}
    </Typography>
    <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
  </Box>
);

export const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useLang();

  const features: Feature[] = FEATURE_KEYS.map((key, i) => ({
    title: t.home.features[key].title,
    description: t.home.features[key].description,
    icon: FEATURE_ICONS[i],
    badge: (t.home.features[key] as any).badge,
  }));

  const stats: Stat[] = STAT_KEYS.map(key => ({
    label: t.home.stats[key].label,
    value: t.home.stats[key].value,
  }));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 6 }, py: { xs: 2, md: 4 } }}>

      <Box sx={{ textAlign: 'center', maxWidth: 640, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2.5, px: 1 }}>
        <Chip label={t.home.badge} variant="outlined" color="primary" sx={{ fontWeight: 700, borderRadius: '999px', fontSize: '0.7rem' }} />
        <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem' }, lineHeight: 1.2 }}>
          {`${t.home.heroTitle} `}
          <Box component="span" sx={{ background: BRAND.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {t.home.heroHighlight}
          </Box>
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 480, lineHeight: 1.7, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
          {t.home.heroDescription}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="contained" size="medium" endIcon={<FiArrowRight />} onClick={() => navigate('/register')} sx={{ borderRadius: '999px', px: 3, fontWeight: 700, fontSize: '0.8rem' }}>
            {t.home.startFree}
          </Button>
          <Button variant="outlined" size="medium" onClick={() => navigate('/login')} sx={{ borderRadius: '999px', px: 3, fontWeight: 700, fontSize: '0.8rem' }}>
            {t.home.doLogin}
          </Button>
        </Box>
      </Box>

      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
          {stats.map((stat, i) => <StatItem key={stat.label} stat={stat} index={i} total={stats.length} />)}
        </Box>
      </Card>

      <Box>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', sm: '1.3rem' } }}>
            {t.home.featuresTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
            {t.home.featuresSubtitle}
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: { xs: 2, sm: 2.5 } }}>
          {features.map(f => <FeatureCard key={f.title} feature={f} />)}
        </Box>
      </Box>

      <Box sx={{ borderRadius: `${LAYOUT.borderRadius}px`, background: BRAND.gradient, p: { xs: 3, md: 5 }, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box sx={{ fontSize: 32, color: '#fff' }}><FiZap /></Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '1.1rem', sm: '1.4rem' } }}>
          {t.home.ctaTitle}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.85, maxWidth: 420, color: '#fff', fontSize: { xs: '0.75rem', sm: '0.85rem' } }}>
          {t.home.ctaDescription}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/register')}
          sx={{ bgcolor: '#fff', color: '#6366f1', fontWeight: 700, borderRadius: '999px', px: 4, '&:hover': { bgcolor: '#f1f5f9' } }}
        >
          {t.home.ctaButton}
        </Button>
      </Box>
    </Box>
  );
};
