import type { ReactElement } from 'react';
import { Chip } from '@mui/material';
import { FiClock, FiCheckCircle } from 'react-icons/fi';

type Status = 'sent' | 'scheduled';

interface StatusConfig {
  label: string;
  color: 'success' | 'warning';
  icon: ReactElement;
}

const STATUS_CONFIG: Record<Status, StatusConfig> = {
  sent:      { label: 'Enviada',  color: 'success', icon: <FiCheckCircle /> },
  scheduled: { label: 'Agendada', color: 'warning', icon: <FiClock /> },
};

interface Props { status: Status }

export const StatusChip = ({ status }: Props) => {
  const { label, color, icon } = STATUS_CONFIG[status];
  return (
    <Chip label={label} color={color} size="small" icon={icon} variant="outlined" />
  );
};
