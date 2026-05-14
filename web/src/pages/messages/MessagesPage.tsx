import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Card, CardContent, Typography, Box, Tabs, Tab,
  Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, OutlinedInput, Chip,
} from '@mui/material';
import { FiPlus, FiArrowLeft, FiMessageSquare, FiCalendar, FiUsers } from 'react-icons/fi';
import { useMessages } from '@/entities/message/model/hooks';
import { useContacts } from '@/entities/contact/model/hooks';
import { createMessage, deleteMessage } from '@/entities/message/api';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog';
import { usePagination } from '@/shared/hooks/usePagination';
import { useLang } from '@/shared/hooks/useLang';
import { PageLoader } from '@/shared/ui/PageLoader';
import { PageHeader } from '@/shared/ui/PageHeader';
import { EmptyState } from '@/shared/ui/EmptyState';
import { StatusChip } from '@/shared/ui/StatusChip';
import { PaginationBar } from '@/shared/ui/PaginationBar';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { ActionButtonGroup, buildDeleteAction } from '@/shared/ui/ActionButtonGroup';

type FilterTab = 0 | 1 | 2;

const filterMessages = <T extends { status: string }>(messages: T[], tab: FilterTab): T[] => {
  if (tab === 1) return messages.filter(m => m.status === 'sent');
  if (tab === 2) return messages.filter(m => m.status === 'scheduled');
  return messages;
};

const formatScheduledDate = (iso: string) => new Date(iso).toLocaleString('pt-BR');

const resolveContactIds = (value: string | string[]): string[] =>
  typeof value === 'string' ? value.split(',') : value;

interface MessageCardProps {
  content: string;
  status: 'sent' | 'scheduled';
  scheduledFor?: string | null;
  contactCount: number;
  contactCountLabel: string;
  deleteLabel: string;
  onDelete: () => void;
}

const MessageCard = ({ content, status, scheduledFor, contactCount, contactCountLabel, deleteLabel, onDelete }: MessageCardProps) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <StatusChip status={status} />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ lineHeight: 1.7, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
      >
        {content}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip icon={<FiUsers size={12} />} label={contactCountLabel.replace('{count}', String(contactCount))} size="small" variant="outlined" />
        {status === 'scheduled' && scheduledFor && (
          <Chip icon={<FiCalendar size={12} />} label={formatScheduledDate(scheduledFor)} size="small" variant="outlined" color="warning" />
        )}
      </Box>
      <ActionButtonGroup actions={[buildDeleteAction(onDelete, deleteLabel)]} columns={1} />
    </CardContent>
  </Card>
);

export const MessagesPage = () => {
  const { connectionId } = useParams<{ connectionId: string }>();
  const navigate = useNavigate();
  const { messages, loading: loadingMessages } = useMessages(connectionId!);
  const { contacts, loading: loadingContacts } = useContacts(connectionId!);
  const { uid } = useCurrentUser();
  const { confirmState, requestConfirm, closeConfirm, handleConfirm } = useConfirmDialog();
  const { t } = useLang();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState<FilterTab>(0);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');

  const filtered = filterMessages(messages, tabValue);
  const { page, pageCount, pageItems, hasPagination, goToPage } = usePagination(filtered);

  const tabLabels = [t.messages.tabAll, t.messages.tabSent, t.messages.tabScheduled];

  const createMut = useMutation({
    mutationFn: (p: { contactIds: string[]; content: string; scheduledFor: string | null }) =>
      createMessage(uid!, connectionId!, p.contactIds, p.content, p.scheduledFor),
  });
  const deleteMut = useMutation({ mutationFn: (id: string) => deleteMessage(id) });

  const resetDialog = useCallback(() => {
    setSelectedContactIds([]);
    setContent('');
    setScheduledFor('');
  }, []);

  const openDialog = useCallback(() => { resetDialog(); setDialogOpen(true); }, [resetDialog]);
  const closeDialog = useCallback(() => { setDialogOpen(false); resetDialog(); }, [resetDialog]);

  const handleSave = useCallback(async () => {
    if (!content.trim() || selectedContactIds.length === 0 || !uid) return;
    await createMut.mutateAsync({ contactIds: selectedContactIds, content: content.trim(), scheduledFor: scheduledFor || null });
    closeDialog();
  }, [content, selectedContactIds, uid, scheduledFor, createMut, closeDialog]);

  const handleDelete = useCallback(
    (id: string) => {
      requestConfirm(t.messages.deleteTitle, t.messages.deleteMessage, () => deleteMut.mutate(id));
    },
    [requestConfirm, deleteMut, t],
  );

  if (loadingMessages || loadingContacts) return <PageLoader />;

  const hasMessages = filtered.length > 0;
  const resolveSaveLabel = () => {
    if (createMut.isPending) return t.messages.sending;
    return scheduledFor ? t.messages.schedule : t.messages.sendNow;
  };

  return (
    <Box>
      <PageHeader
        title={t.messages.title}
        subtitle={t.messages.subtitle.replace('{count}', String(messages.length))}
        icon={<FiMessageSquare />}
        action={
          <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<FiArrowLeft size={14} />} onClick={() => navigate('/connections')} size="small" sx={{ flex: { xs: 1, sm: 'none' } }}>
              {t.common.back}
            </Button>
            <Button variant="contained" startIcon={<FiPlus size={16} />} onClick={openDialog} sx={{ flex: { xs: 1, sm: 'none' } }}>
              {t.messages.newMessage}
            </Button>
          </Box>
        }
      />

      <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        {tabLabels.map((label, i) => <Tab key={label} label={label} value={i} />)}
      </Tabs>

      {!hasMessages && <EmptyState icon={<FiMessageSquare />} message={t.messages.empty} />}

      {hasMessages && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2.5 }}>
          {pageItems.map(msg => (
            <MessageCard
              key={msg.id}
              content={msg.content}
              status={msg.status}
              scheduledFor={msg.scheduledFor}
              contactCount={msg.contactIds.length}
              contactCountLabel={t.messages.contactCount}
              deleteLabel={t.common.delete}
              onDelete={() => handleDelete(msg.id)}
            />
          ))}
        </Box>
      )}

      <PaginationBar page={page} pageCount={pageCount} visible={hasPagination} onChange={goToPage} />

      <Dialog open={dialogOpen} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t.messages.dialogTitle}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>{t.messages.contactsLabel}</InputLabel>
              <Select
                multiple
                value={selectedContactIds}
                onChange={e => setSelectedContactIds(resolveContactIds(e.target.value))}
                input={<OutlinedInput label={t.messages.contactsLabel} />}
                renderValue={selected => (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {selected.map(id => <Chip key={id} label={contacts.find(c => c.id === id)?.name ?? id} size="small" />)}
                  </Box>
                )}
              >
                {contacts.map(c => (
                  <MenuItem key={c.id} value={c.id}>
                    <Checkbox checked={selectedContactIds.includes(c.id)} size="small" />
                    <ListItemText primary={c.name} secondary={c.phone} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label={t.messages.messageLabel} multiline rows={4} fullWidth value={content} onChange={e => setContent(e.target.value)} />
            <TextField label={t.messages.scheduleLabel} type="datetime-local" fullWidth value={scheduledFor} onChange={e => setScheduledFor(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} variant="text">{t.common.cancel}</Button>
          <Button onClick={handleSave} variant="contained" disabled={!content.trim() || selectedContactIds.length === 0 || createMut.isPending}>
            {resolveSaveLabel()}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog open={confirmState.open} title={confirmState.title} message={confirmState.message} onConfirm={handleConfirm} onCancel={closeConfirm} />
    </Box>
  );
};
