import Alert from '@mui/material/Alert';
import { FEATURES } from '@/shared/config/features';
import { useTranslation } from '@/shared/i18n/useTranslation';

// Shown while the dispatchScheduledMessages Cloud Function is not deployed
// (VITE_SCHEDULED_DISPATCH_ENABLED=false), so scheduled messages are never flipped to sent.
export const ScheduledDispatchNotice = ({ className }: Readonly<{ className?: string }>) => {
  const { t } = useTranslation();

  if (FEATURES.scheduledDispatch) return null;

  return (
    <Alert severity="warning" className={className}>
      {t('broadcast.dispatchInactive')}
    </Alert>
  );
};
