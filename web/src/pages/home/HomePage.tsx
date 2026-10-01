import ArrowForward from '@mui/icons-material/ArrowForward';
import BoltOutlined from '@mui/icons-material/BoltOutlined';
import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import HubOutlined from '@mui/icons-material/HubOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import type { ReactElement } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '@/shared/config/routes';
import { useTranslation } from '@/shared/i18n/useTranslation';

const FEATURES = [
  { key: 'connections', icon: <HubOutlined /> },
  { key: 'contacts', icon: <PeopleOutlined /> },
  { key: 'broadcast', icon: <CampaignOutlined /> },
  { key: 'scheduling', icon: <ScheduleOutlined /> },
  { key: 'isolation', icon: <ShieldOutlined /> },
  { key: 'realtime', icon: <BoltOutlined /> },
] as const satisfies ReadonlyArray<{ key: string; icon: ReactElement }>;

const FEATURES_TITLE_ID = 'features-title';

type Feature = (typeof FEATURES)[number];

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
      <Chip label={t('home.badge')} color="primary" variant="outlined" />
      <Typography variant="h3" component="h1" className="text-3xl font-extrabold sm:text-5xl">
        {`${t('home.title')} `}
        <span className="brand-gradient-text">{t('home.highlight')}</span>
      </Typography>
      <Typography variant="body1" color="text.secondary" className="max-w-xl">
        {t('home.description')}
      </Typography>
      <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
        <Button component={Link} to={ROUTES.register} variant="contained" size="large" endIcon={<ArrowForward />}>
          {t('home.ctaPrimary')}
        </Button>
        <Button component={Link} to={ROUTES.login} variant="outlined" size="large">
          {t('home.ctaSecondary')}
        </Button>
      </div>
    </section>
  );
};

const FeatureCard = ({ feature }: Readonly<{ feature: Feature }>) => {
  const { t } = useTranslation();

  return (
    <Card className="flex h-full flex-col items-center gap-2 p-5 text-center sm:items-start sm:text-left">
      <span className="brand-gradient flex size-10 items-center justify-center rounded-lg text-white">
        {feature.icon}
      </span>
      <Typography variant="subtitle1" component="h3" className="font-bold">
        {t(`home.features.${feature.key}.title`)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t(`home.features.${feature.key}.description`)}
      </Typography>
    </Card>
  );
};

const FeaturesSection = () => {
  const { t } = useTranslation();

  return (
    <section aria-labelledby={FEATURES_TITLE_ID} className="flex flex-col gap-6">
      <Typography id={FEATURES_TITLE_ID} variant="h5" component="h2" className="text-center font-bold">
        {t('home.featuresTitle')}
      </Typography>
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <li key={feature.key}>
            <FeatureCard feature={feature} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export const HomePage = () => (
  <div className="flex flex-col gap-16 py-4 sm:py-10">
    <HeroSection />
    <FeaturesSection />
  </div>
);
