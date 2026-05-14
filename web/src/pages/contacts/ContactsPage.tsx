import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Card, CardContent, Typography, Box,
} from '@mui/material';
import { FiPlus, FiArrowLeft, FiPhone, FiUsers } from 'react-icons/fi';
import { useContacts } from '@/entities/contact/model/hooks';
import { createContact, updateContact, deleteContact } from '@/entities/contact/api';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog';
import { usePagination } from '@/shared/hooks/usePagination';
import { PageLoader } from '@/shared/ui/PageLoader';
import { PageHeader } from '@/shared/ui/PageHeader';
import { EmptyState } from '@/shared/ui/EmptyState';
import { PaginationBar } from '@/shared/ui/PaginationBar';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { ActionButtonGroup, buildEditAction, buildDeleteAction } from '@/shared/ui/ActionButtonGroup';

interface ContactFormState { id: string | null; name: string; phone: string }

const INITIAL_FORM: ContactFormState = { id: null, name: '', phone: '' };
const GRID_COLUMNS = { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' };

const buildSubtitle = (count: number) => `${count} contato(s) cadastrado(s)`;

interface ContactDialogProps {
  open: boolean;
  form: ContactFormState;
  isPending: boolean;
  onChange: (field: 'name' | 'phone', value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const DIALOG_TITLES = { create: 'Novo Contato', edit: 'Editar Contato' } as const;
const SAVE_LABELS = { idle: 'Salvar', pending: 'Salvando...' } as const;

const ContactDialog = ({ open, form, isPending, onChange, onClose, onSave }: ContactDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>{form.id ? DIALOG_TITLES.edit : DIALOG_TITLES.create}</DialogTitle>
    <DialogContent>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <TextField autoFocus label="Nome" value={form.name} onChange={e => onChange('name', e.target.value)} fullWidth />
        <TextField label="Telefone" value={form.phone} onChange={e => onChange('phone', e.target.value)} fullWidth />
      </Box>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} variant="text">Cancelar</Button>
      <Button onClick={onSave} variant="contained" disabled={!form.name.trim() || !form.phone.trim() || isPending}>
        {isPending ? SAVE_LABELS.pending : SAVE_LABELS.idle}
      </Button>
    </DialogActions>
  </Dialog>
);

interface ContactCardProps {
  name: string;
  phone: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ContactCard = ({ name, phone, onEdit, onDelete }: ContactCardProps) => {
  const actions = useMemo(
    () => [buildEditAction(onEdit), buildDeleteAction(onDelete)],
    [onEdit, onDelete],
  );

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            {name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: 'text.secondary', mt: 0.5 }}>
            <FiPhone size={13} />
            <Typography variant="body2">{phone}</Typography>
          </Box>
        </Box>
        <ActionButtonGroup actions={actions} />
      </CardContent>
    </Card>
  );
};

export const ContactsPage = () => {
  const { connectionId } = useParams<{ connectionId: string }>();
  const navigate = useNavigate();
  const { contacts, loading } = useContacts(connectionId!);
  const { uid } = useCurrentUser();
  const { confirmState, requestConfirm, closeConfirm, handleConfirm } = useConfirmDialog();
  const { page, pageCount, pageItems, hasPagination, goToPage } = usePagination(contacts);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);

  const createMut = useMutation({
    mutationFn: ({ name, phone }: { name: string; phone: string }) => createContact(uid!, connectionId!, name, phone),
  });
  const updateMut = useMutation({
    mutationFn: ({ id, name, phone }: { id: string; name: string; phone: string }) => updateContact(id, name, phone),
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteContact(id),
  });

  const openCreate = useCallback(() => {
    setForm(INITIAL_FORM);
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((id: string, name: string, phone: string) => {
    setForm({ id, name, phone });
    setDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    setForm(INITIAL_FORM);
  }, []);

  const handleChange = useCallback(
    (field: 'name' | 'phone', value: string) => setForm(f => ({ ...f, [field]: value })),
    [],
  );

  const handleSave = useCallback(async () => {
    if (!form.name.trim() || !form.phone.trim() || !uid) return;
    if (form.id) {
      await updateMut.mutateAsync({ id: form.id, name: form.name.trim(), phone: form.phone.trim() });
    } else {
      await createMut.mutateAsync({ name: form.name.trim(), phone: form.phone.trim() });
    }
    closeDialog();
  }, [form, uid, updateMut, createMut, closeDialog]);

  const handleDelete = useCallback(
    (id: string, contactName: string) => {
      requestConfirm(
        'Excluir Contato',
        `Tem certeza que deseja excluir o contato "${contactName}"? Essa acao nao pode ser desfeita.`,
        () => deleteMut.mutate(id),
      );
    },
    [requestConfirm, deleteMut],
  );

  if (loading) return <PageLoader />;

  const hasContacts = contacts.length > 0;

  return (
    <Box>
      <PageHeader
        title="Contatos"
        subtitle={buildSubtitle(contacts.length)}
        icon={<FiUsers />}
        action={
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<FiArrowLeft size={14} />}
              onClick={() => navigate('/connections')}
              size="small"
              sx={{ flex: { xs: 1, sm: 'none' } }}
            >
              Voltar
            </Button>
            <Button
              variant="contained"
              startIcon={<FiPlus size={16} />}
              onClick={openCreate}
              sx={{ flex: { xs: 1, sm: 'none' } }}
            >
              Novo Contato
            </Button>
          </Box>
        }
      />

      {!hasContacts && (
        <EmptyState icon={<FiUsers />} message="Nenhum contato. Adicione o primeiro!" />
      )}

      {hasContacts && (
        <Box sx={{ display: 'grid', gridTemplateColumns: GRID_COLUMNS, gap: 2.5 }}>
          {pageItems.map(c => (
            <ContactCard
              key={c.id}
              name={c.name}
              phone={c.phone}
              onEdit={() => openEdit(c.id, c.name, c.phone)}
              onDelete={() => handleDelete(c.id, c.name)}
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

      <ContactDialog
        open={dialogOpen}
        form={form}
        isPending={createMut.isPending || updateMut.isPending}
        onChange={handleChange}
        onClose={closeDialog}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </Box>
  );
};
