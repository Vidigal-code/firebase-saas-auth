import ArrowBack from '@mui/icons-material/ArrowBack';
import CampaignOutlined from '@mui/icons-material/CampaignOutlined';
import LinkOffOutlined from '@mui/icons-material/LinkOffOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import type { ReactElement } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router';
import type { Connection } from '@/entities/connection/model/types';
import { useConnection } from '@/entities/connection/model/useConnections';
import { useConnectionScope } from '@/entities/session/useConnectionScope';
import { buildBroadcastPath, buildContactsPath, ROUTES } from '@/shared/config/routes';
import type { TranslationKey } from '@/shared/i18n/translate';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { EmptyState } from '@/shared/ui/EmptyState';
import { PageLoader } from '@/shared/ui/PageLoader';
import type { ConnectionOutletContext } from './connectionContext';

interface ConnectionSection {
  labelKey: TranslationKey;
  icon: ReactElement;
  buildPath: (connectionId: string) => string;
}

const CONNECTION_SECTIONS: readonly ConnectionSection[] = [
  { labelKey: 'contacts.title', icon: <PeopleOutlined />, buildPath: buildContactsPath },
  { labelKey: 'broadcast.title', icon: <CampaignOutlined />, buildPath: buildBroadcastPath },
];

interface ConnectionProps {
  connection: Connection;
}

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

const ConnectionSectionTabs = ({ connection }: Readonly<ConnectionProps>) => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <Tabs value={pathname} variant="fullWidth" className="w-full border-b border-divider sm:max-w-md">
      {CONNECTION_SECTIONS.map(({ labelKey, icon, buildPath }) => {
        const path = buildPath(connection.id);

        return (
          <Tab
            key={path}
            component={Link}
            to={path}
            value={path}
            icon={icon}
            iconPosition="start"
            label={t(labelKey)}
          />
        );
      })}
    </Tabs>
  );
};

const ConnectionHeader = ({ connection }: Readonly<ConnectionProps>) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      <Button component={Link} to={ROUTES.connections} startIcon={<ArrowBack />} className="self-center sm:self-start">
        {t('connections.backToList')}
      </Button>
      <Typography
        variant="h5"
        component="h1"
        className="truncate text-center font-bold sm:text-left"
        title={connection.name}
      >
        {connection.name}
      </Typography>
      <ConnectionSectionTabs connection={connection} />
    </div>
  );
};

export const ConnectionLayout = () => {
  const { connectionId = '' } = useParams();
  const { status, data: connection } = useConnection(connectionId);
  const scope = useConnectionScope(connectionId);

  if (status === 'loading') return <PageLoader />;
  if (!connection) return <ConnectionNotFound />;

  const context: ConnectionOutletContext = { connection, scope };

  return (
    <div className="flex flex-col gap-6">
      <ConnectionHeader connection={connection} />
      <Outlet context={context} />
    </div>
  );
};
