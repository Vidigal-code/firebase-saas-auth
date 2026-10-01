import AddRounded from '@mui/icons-material/AddRounded';
import HubOutlined from '@mui/icons-material/HubOutlined';
import Button from '@mui/material/Button';
import { deleteConnection } from '@/entities/connection/api/connectionsRepository';
import type { Connection } from '@/entities/connection/model/types';
import { useConnections } from '@/entities/connection/model/useConnections';
import { ConnectionCard } from '@/entities/connection/ui/ConnectionCard';
import { ConnectionFormDialog } from '@/features/connection-editor/ConnectionFormDialog';
import { useEditorState } from '@/shared/hooks/useEditorState';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { EmptyState } from '@/shared/ui/EmptyState';
import { PageHeader } from '@/shared/ui/PageHeader';
import { PaginatedGrid } from '@/shared/ui/PaginatedGrid';
import { QueryBoundary } from '@/shared/ui/QueryBoundary';
import { useDeleteConfirmation } from '@/shared/ui/useDeleteConfirmation';

export const ConnectionsPage = () => {
  const { t } = useTranslation();
  const { status, data: connections } = useConnections();
  const editor = useEditorState<Connection>();
  const deletion = useDeleteConfirmation<Connection>({
    remove: (connection) => deleteConnection(connection.id),
    describe: (connection) => ({
      title: t('connections.deleteTitle'),
      message: t('connections.deleteMessage', { name: connection.name }),
    }),
    successMessage: t('connections.deleted'),
  });

  return (
    <>
      <PageHeader
        title={t('connections.title')}
        subtitle={t('connections.subtitle', { count: connections.length })}
        actions={
          <Button variant="contained" startIcon={<AddRounded />} onClick={editor.openCreate}>
            {t('connections.new')}
          </Button>
        }
      />
      <QueryBoundary status={status}>
        <PaginatedGrid
          items={connections}
          getKey={(connection) => connection.id}
          renderItem={(connection) => (
            <ConnectionCard connection={connection} onEdit={editor.openEdit} onDelete={deletion.request} />
          )}
          empty={
            <EmptyState
              icon={<HubOutlined fontSize="inherit" />}
              title={t('connections.empty')}
              description={t('connections.emptyHint')}
            />
          }
        />
      </QueryBoundary>
      {editor.state.open && <ConnectionFormDialog connection={editor.state.target} onClose={editor.close} />}
      <ConfirmDialog {...deletion.dialogProps} />
    </>
  );
};
