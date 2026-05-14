import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';
import { FiPlus, FiLink } from 'react-icons/fi';
import { useConnections } from '@/entities/connection/model/hooks';
import { ConnectionCard } from '@/entities/connection/ui/ConnectionCard';
import { ConnectionDialog } from '@/features/connection/ui/ConnectionDialog';
import { useConnectionCrud } from '@/features/connection/hooks/useConnectionCrud';
import { usePagination } from '@/shared/hooks/usePagination';
import { useLang } from '@/shared/hooks/useLang';
import { PageLoader } from '@/shared/ui/PageLoader';
import { PageHeader } from '@/shared/ui/PageHeader';
import { EmptyState } from '@/shared/ui/EmptyState';
import { PaginationBar } from '@/shared/ui/PaginationBar';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';

const GRID_COLUMNS = { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' };

const buildContactsPath = (id: string) => `/connections/${id}/contacts`;
const buildMessagesPath = (id: string) => `/connections/${id}/messages`;

export const ConnectionsPage = () => {
  const { connections, loading } = useConnections();
  const navigate = useNavigate();
  const crud = useConnectionCrud();
  const { page, pageCount, pageItems, hasPagination, goToPage } = usePagination(connections);
  const { t } = useLang();

  if (loading) return <PageLoader />;

  const hasConnections = connections.length > 0;

  return (
    <Box>
      <PageHeader
        title={t.connections.title}
        subtitle={t.connections.subtitle.replace('{count}', String(connections.length))}
        icon={<FiLink />}
        action={
          <Button variant="contained" startIcon={<FiPlus size={16} />} onClick={crud.openCreate} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            {t.connections.newConnection}
          </Button>
        }
      />

      {!hasConnections && (
        <EmptyState icon={<FiLink />} message={t.connections.empty} />
      )}

      {hasConnections && (
        <Box sx={{ display: 'grid', gridTemplateColumns: GRID_COLUMNS, gap: 3 }}>
          {pageItems.map(conn => (
            <ConnectionCard
              key={conn.id}
              name={conn.name}
              onEdit={() => crud.openEdit(conn.id, conn.name)}
              onDelete={() => crud.requestDelete(conn.id, conn.name)}
              onContacts={() => navigate(buildContactsPath(conn.id))}
              onMessages={() => navigate(buildMessagesPath(conn.id))}
            />
          ))}
        </Box>
      )}

      <PaginationBar
        page={page}
        pageCount={pageCount}
        visible={hasPagination}
        onChange={goToPage}
      />

      <ConnectionDialog
        open={crud.dialog.open}
        isEdit={!!crud.dialog.editId}
        name={crud.dialog.name}
        isPending={crud.isPending}
        onNameChange={crud.setName}
        onClose={crud.closeDialog}
        onSave={crud.save}
      />

      <ConfirmDialog
        open={crud.confirm.confirmState.open}
        title={crud.confirm.confirmState.title}
        message={crud.confirm.confirmState.message}
        onConfirm={crud.confirm.handleConfirm}
        onCancel={crud.confirm.closeConfirm}
      />
    </Box>
  );
};
