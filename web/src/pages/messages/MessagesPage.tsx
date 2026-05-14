import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import {
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Card, CardContent, Typography, Box, Tabs, Tab,
  Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, OutlinedInput, Chip,
} from '@mui/material';
import {
  FiPlus, FiArrowLeft, FiMessageSquare, FiCalendar, FiUsers,
} from 'react-icons/fi';
import { useMessages } from '@/entities/message/model/hooks';
import { useContacts } from '@/entities/contact/model/hooks';
import { createMessage, deleteMessage } from '@/entities/message/api';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog';
import { usePagination } from '@/shared/hooks/usePagination';
import { PageLoader } from '@/shared/ui/PageLoader';
import { PageHeader } from '@/shared/ui/PageHeader';
import { EmptyState } from '@/shared/ui/EmptyState';
import { StatusChip } from '@/shared/ui/StatusChip';
import { PaginationBar } from '@/shared/ui/PaginationBar';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';
import { ActionButtonGroup, buildDeleteAction } from '@/shared/ui/ActionButtonGroup';

type FilterTab = 0 | 1 | 2;

const MESSAGE_TABS = ['Todas', 'Enviadas', 'Agendadas'] as const;
const GRID_COLUMNS = { xs: '1fr', md: 'repeat(2, 1fr)' };
const SAVE_LABELS = { idle: 'Enviar Agora', scheduled: 'Agendar', pending: 'Enviando...' } as const;

const filterMessages = <T extends { status: string }>(messages: T[], tab: FilterTab): T[] => {
  if (tab === 1) return messages.filter(m => m.status === 'sent');
  if (tab === 2) return messages.filter(m => m.status === 'scheduled');
  return messages;
};

const buildSubtitle = (count: number) => `${count} mensagem(ns) no total`;

const resolveSaveLabel = (isPending: boolean, scheduledFor: string) => {
  if (isPending) return SAVE_LABELS.pending;
  return scheduledFor ? SAVE_LABELS.scheduled : SAVE_LABELS.idle;
};

const formatScheduledDate = (iso: string) => new Date(iso).toLocaleString('pt-BR');

interface MessageCardProps {
  content: string;
  status: 'sent' | 'scheduled';
  scheduledFor?: string | null;
  contactCount: number;
  onDelete: () => void;
}

const MessageCard = ({ content, status, scheduledFor, contactCount, onDelete }: MessageCardProps) => (
  <Card sx={{ height: '100%' }}>
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <StatusChip status={status} />
      </Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          lineHeight: 1.7,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {content}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip icon={<FiUsers size={12} />} label={`${contactCount} contato(s)`} size="small" variant="outlined" />
        {status === 'scheduled' && scheduledFor && (
          <Chip
            icon={<FiCalendar size={12} />}
            label={formatScheduledDate(scheduledFor)}
            size="small"
            variant="outlined"
            color="warning"
          />
        )}
      </Box>
      <ActionButtonGroup actions={[buildDeleteAction(onDelete)]} />
    </CardContent>
  </Card>
);

interface Contact { id: string; name: string; phone: string }

interface MessageDialogProps {
  open: boolean;
  contacts: Contact[];
  selectedContactIds: string[];
  content: string;
  scheduledFor: string;
  isPending: boolean;
  onContactsChange: (ids: string[]) => void;
  onContentChange: (v: string) => void;
  onScheduledForChange: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const resolveContactIds = (value: string | string[]): string[] =>
  typeof value === 'string' ? value.split(',') : value;

const MessageDialog = ({
  open, contacts, selectedContactIds, content, scheduledFor, isPending,
  onContactsChange, onContentChange, onScheduledForChange, onClose, onSave,
}: MessageDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>Nova Mensagem</DialogTitle>
    <DialogContent>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
        <FormControl fullWidth>
          <InputLabel>Contatos</InputLabel>
          <Select
            multiple
            value={selectedContactIds}
            onChange={e => onContactsChange(resolveContactIds(e.target.value))}
            input={<OutlinedInput label="Contatos" />}
            renderValue={selected => (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {selected.map(id => (
                  <Chip key={id} label={contacts.find(c => c.id === id)?.name ?? id} size="small" />
                ))}
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
        <TextField
          label="Mensagem"
          multiline
          rows={4}
          fullWidth
          value={content}
          onChange={e => onContentChange(e.target.value)}
        />
        <TextField
          label="Agendar para (Opcional)"
          type="datetime-local"
          fullWidth
          value={scheduledFor}
          onChange={e => onScheduledForChange(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Box>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} variant="text">Cancelar</Button>
      <Button
        onClick={onSave}
        variant="contained"
        disabled={!content.trim() || selectedContactIds.length === 0 || isPending}
      >
        {resolveSaveLabel(isPending, scheduledFor)}
      </Button>
    </DialogActions>
  </Dialog>
);

export const MessagesPage = () => {
  const { connectionId } = useParams<{ connectionId: string }>();
  const navigate = useNavigate();
  const { messages, loading: loadingMessages } = useMessages(connectionId!);
  const { contacts, loading: loadingContacts } = useContacts(connectionId!);
  const { uid } = useCurrentUser();
  const { confirmState, requestConfirm, closeConfirm, handleConfirm } = useConfirmDialog();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState<FilterTab>(0);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');

  const filtered = filterMessages(messages, tabValue);
  const { page, pageCount, pageItems, hasPagination, goToPage } = usePagination(filtered);

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

  const openDialog = useCallback(() => {
    resetDialog();
    setDialogOpen(true);
  }, [resetDialog]);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
    resetDialog();
  }, [resetDialog]);

  const handleSave = useCallback(async () => {
    if (!content.trim() || selectedContactIds.length === 0 || !uid) return;
    await createMut.mutateAsync({
      contactIds: selectedContactIds,
      content: content.trim(),
      scheduledFor: scheduledFor || null,
    });
    closeDialog();
  }, [content, selectedContactIds, uid, scheduledFor, createMut, closeDialog]);

  const handleDelete = useCallback(
    (id: string) => {
      requestConfirm(
        'Excluir Mensagem',
        'Tem certeza que deseja excluir esta mensagem? Essa acao nao pode ser desfeita.',
        () => deleteMut.mutate(id),
      );
    },
    [requestConfirm, deleteMut],
  );

  if (loadingMessages || loadingContacts) return <PageLoader />;

  const hasMessages = filtered.length > 0;

  return (
    <Box>
      <PageHeader
        title="Mensagens"
        subtitle={buildSubtitle(messages.length)}
        icon={<FiMessageSquare />}
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
              onClick={openDialog}
              sx={{ flex: { xs: 1, sm: 'none' } }}
            >
              Nova Mensagem
            </Button>
          </Box>
        }
      />

      <Tabs
        value={tabValue}
        onChange={(_, v) => setTabValue(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 3, borderBottom: '1px solid', borderColor: 'divider' }}
      >
        {MESSAGE_TABS.map((label, i) => <Tab key={label} label={label} value={i} />)}
      </Tabs>

      {!hasMessages && (
        <EmptyState icon={<FiMessageSquare />} message="Nenhuma mensagem nesta categoria." />
      )}

      {hasMessages && (
        <Box sx={{ display: 'grid', gridTemplateColumns: GRID_COLUMNS, gap: 2.5 }}>
          {pageItems.map(msg => (
            <MessageCard
              key={msg.id}
              content={msg.content}
              status={msg.status}
              scheduledFor={msg.scheduledFor}
              contactCount={msg.contactIds.length}
              onDelete={() => handleDelete(msg.id)}
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

      <MessageDialog
        open={dialogOpen}
        contacts={contacts}
        selectedContactIds={selectedContactIds}
        content={content}
        scheduledFor={scheduledFor}
        isPending={createMut.isPending}
        onContactsChange={setSelectedContactIds}
        onContentChange={setContent}
        onScheduledForChange={setScheduledFor}
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
