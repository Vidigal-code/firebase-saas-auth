import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import HubOutlined from '@mui/icons-material/HubOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router';
import { buildBroadcastPath, buildContactsPath } from '@/shared/config/routes';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { EditDeleteActions } from '@/shared/ui/CardActions';
import type { Connection } from '../model/types';

export interface ConnectionCardProps {
  connection: Connection;
  onEdit: (connection: Connection) => void;
  onDelete: (connection: Connection) => void;
}

export const ConnectionCard = ({ connection, onEdit, onDelete }: Readonly<ConnectionCardProps>) => {
  const { t, formatDateTime } = useTranslation();

  return (
    <Card component="article" className="flex h-full flex-col gap-4 p-4">
      <div className="flex items-start gap-3">
        <span className="brand-gradient flex size-10 shrink-0 items-center justify-center rounded-lg text-white">
          <HubOutlined />
        </span>
        <div className="min-w-0 flex-1">
          <Typography variant="subtitle1" component="h2" className="truncate font-bold" title={connection.name}>
            {connection.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('connections.createdAt', { date: formatDateTime(connection.createdAt) })}
          </Typography>
        </div>
        <EditDeleteActions
          itemLabel={connection.name}
          onEdit={() => onEdit(connection)}
          onDelete={() => onDelete(connection)}
        />
      </div>
      <div className="mt-auto grid grid-cols-2 gap-2">
        <Button
          component={Link}
          to={buildContactsPath(connection.id)}
          variant="outlined"
          startIcon={<PeopleOutlined />}
        >
          {t('connections.openContacts')}
        </Button>
        <Button
          component={Link}
          to={buildBroadcastPath(connection.id)}
          variant="contained"
          startIcon={<CampaignOutlined />}
        >
          {t('connections.openBroadcast')}
        </Button>
      </div>
    </Card>
  );
};
