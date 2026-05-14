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
import { useLang } from '@/shared/hooks/useLang';
import { PageLoader } from '@/shared/ui/PageLoader';
import { PageHeader } from '@/shared/ui/PageHeader';
import { EmptyState } from '@/shared/ui/EmptyState';
import { PaginationBar } from '@/shared/ui/PaginationBar';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { ActionButtonGroup, buildEditAction, buildDeleteAction } from '@/shared/ui/ActionButtonGroup';

interface ContactFormState { id: string | null; name: string; phone: string }

const INITIAL_FORM: ContactFormState = { id: null, name: '', phone: '' };
const GRID_COLUMNS = { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' };

interface ContactCardProps {
  name: string;
  phone: string;
  editLabel: string;
  deleteLabel: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ContactCard = ({ name, phone, editLabel, deleteLabel, onEdit, onDelete }: ContactCardProps) => {
  const actions = useMemo(
    () => [buildEditAction(onEdit, editLabel), buildDeleteAction(onDelete, deleteLabel)],
    [onEdit, onDelete, editLabel, deleteLabel],
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
  const { t } = useLang();

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
        t.contacts.deleteTitle,
        t.contacts.deleteMessage.replace('{name}', contactName),
        () => deleteMut.mutate(id),
      );
    },
    [requestConfirm, deleteMut, t],
  );

  if (loading) return <PageLoader />;

  const hasContacts = contacts.length > 0;
  const dialogTitle = form.id ? t.contacts.dialogEdit : t.contacts.dialogCreate;
  const saveLabel = (createMut.isPending || updateMut.isPending) ? t.common.saving : t.common.save;

  return (
    <Box>
      <PageHeader
        title={t.contacts.title}
        subtitle={t.contacts.subtitle.replace('{count}', String(contacts.length))}
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
              {t.common.back}
            </Button>
            <Button
              variant="contained"
              startIcon={<FiPlus size={16} />}
              onClick={openCreate}
              sx={{ flex: { xs: 1, sm: 'none' } }}
            >
              {t.contacts.newContact}
            </Button>
          </Box>
        }
      />

      {!hasContacts && (
        <EmptyState icon={<FiUsers />} message={t.contacts.empty} />
      )}

      {hasContacts && (
        <Box sx={{ display: 'grid', gridTemplateColumns: GRID_COLUMNS, gap: 2.5 }}>
          {pageItems.map(c => (
            <ContactCard
              key={c.id}
              name={c.name}
              phone={c.phone}
              editLabel={t.common.edit}
              deleteLabel={t.common.delete}
              onEdit={() => openEdit(c.id, c.name, c.phone)}
              onDelete={() => handleDelete(c.id, c.name)}
            />
          ))}
        </Box>
      )}

      <PaginationBar page={page} pageCount={pageCount} visible={hasPagination} onChange={goToPage} />

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField autoFocus label={t.contacts.nameLabel} value={form.name} onChange={e => handleChange('name', e.target.value)} fullWidth />
            <TextField label={t.contacts.phoneLabel} value={form.phone} onChange={e => handleChange('phone', e.target.value)} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} variant="text">{t.common.cancel}</Button>
          <Button onClick={handleSave} variant="contained" disabled={!form.name.trim() || !form.phone.trim() || createMut.isPending || updateMut.isPending}>
            {saveLabel}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={confirmState.open} title={confirmState.title} message={confirmState.message} onConfirm={handleConfirm} onCancel={closeConfirm} />
    </Box>
  );
};
