import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import ScheduleOutlined from '@mui/icons-material/ScheduleOutlined';
import Chip from '@mui/material/Chip';
import type { ReactElement } from 'react';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { TranslationKey } from '@/shared/i18n/translate';
import type { MessageStatus } from '../model/types';

interface StatusAppearance {
  label: TranslationKey;
  color: 'success' | 'warning';
  icon: ReactElement;
}

const STATUS_APPEARANCE: Record<MessageStatus, StatusAppearance> = {
  sent: { label: 'broadcast.status.sent', color: 'success', icon: <CheckCircleOutlined /> },
  scheduled: { label: 'broadcast.status.scheduled', color: 'warning', icon: <ScheduleOutlined /> },
};

export const MessageStatusChip = ({ status }: Readonly<{ status: MessageStatus }>) => {
  const { t } = useTranslation();
  const { label, color, icon } = STATUS_APPEARANCE[status];

  return <Chip size="small" variant="outlined" color={color} icon={icon} label={t(label)} />;
};
