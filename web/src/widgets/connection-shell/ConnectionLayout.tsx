import ArrowBack from '@mui/icons-material/ArrowBack';
import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import LinkOffOutlined from '@mui/icons-material/LinkOffOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { Link, Outlet, useLocation, useParams } from 'react-router';
import { useConnection } from '@/entities/connection/model/useConnections';
import { useConnectionScope } from '@/entities/session/useConnectionScope';
import { buildBroadcastPath, buildContactsPath, ROUTES } from '@/shared/config/routes';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { EmptyState } from '@/shared/ui/EmptyState';
import { PageLoader } from '@/shared/ui/PageLoader';
import type { ConnectionOutletContext } from './connectionContext';

const ConnectionNotFound = () => {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon={<LinkOffOutlined fontSize="inherit" />}
      title={t('connections.notFound')}
      description={t('connections.notFoundHint')}
      action={
        <Button component={Link} to={ROUTES.connections} variant="contained">
          {t('connections.backToList')}
        </Button>
      }
    />
  );
};

export const ConnectionLayout = () => {
  const { connectionId = '' } = useParams();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const { status, data: connection } = useConnection(connectionId);
  const scope = useConnectionScope(connectionId);

  if (status === 'loading') return <PageLoader />;
  if (!connection) return <ConnectionNotFound />;

  const context: ConnectionOutletContext = { connection, scope };
  const contactsPath = buildContactsPath(connection.id);
  const broadcastPath = buildBroadcastPath(connection.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Button component={Link} to={ROUTES.connections} startIcon={<ArrowBack />} className="self-start">
          {t('connections.backToList')}
        </Button>
        <Typography variant="h5" component="h1" className="truncate font-bold" title={connection.name}>
          {connection.name}
        </Typography>
        <Tabs value={pathname} variant="fullWidth" className="border-b border-divider sm:max-w-md">
          <Tab
            component={Link}
            to={contactsPath}
            value={contactsPath}
            icon={<PeopleOutlined />}
            iconPosition="start"
            label={t('contacts.title')}
          />
          <Tab
            component={Link}
            to={broadcastPath}
            value={broadcastPath}
            icon={<CampaignOutlined />}
            iconPosition="start"
            label={t('broadcast.title')}
          />
        </Tabs>
      </div>
      <Outlet context={context} />
    </div>
  );
};
