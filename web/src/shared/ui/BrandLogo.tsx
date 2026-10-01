import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import { Link } from 'react-router';
import { useTranslation } from '@/shared/i18n/useTranslation';

export const BrandLogo = ({ to }: Readonly<{ to: string }>) => {
  const { t } = useTranslation();

  return (
    <Link to={to} className="flex shrink-0 items-center gap-2 no-underline">
      <span className="brand-gradient flex size-8 items-center justify-center rounded-lg text-white">
        <CampaignOutlined fontSize="small" />
      </span>
      <span className="brand-gradient-text text-lg font-extrabold">{t('common.appName')}</span>
    </Link>
  );
};
