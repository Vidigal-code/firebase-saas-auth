import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useMessages } from '@/entities/message/model/hooks';
import { useContacts } from '@/entities/contact/model/hooks';
import { createMessage, deleteMessage } from '@/entities/message/api';
import { useAppSelector } from '@/shared/hooks/redux';
import { 
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Card, CardContent, Typography, IconButton, CircularProgress, 
  Select, MenuItem, FormControl, InputLabel, Checkbox, ListItemText, OutlinedInput,
  Tabs, Tab
} from '@mui/material';
import { Plus, Trash2, ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';

export const MessagesPage = () => {
  const { connectionId } = useParams<{ connectionId: string }>();
  const navigate = useNavigate();
  const { messages, loading: loadingMessages } = useMessages(connectionId!);
  const { contacts, loading: loadingContacts } = useContacts(connectionId!);
  const { user } = useAppSelector(state => state.user);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [content, setContent] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [scheduledFor, setScheduledFor] = useState('');
  const [tabValue, setTabValue] = useState(0); 

  const createMut = useMutation({
    mutationFn: ({ contactIds, content, scheduledFor }: any) => 
      createMessage(user!.uid, connectionId!, contactIds, content, scheduledFor || null)
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteMessage(id)
  });

  const handleOpen = () => {
    setContent('');
    setSelectedContacts([]);
    setScheduledFor('');
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    if (!content.trim() || selectedContacts.length === 0) return;
    await createMut.mutateAsync({ contactIds: selectedContacts, content, scheduledFor });
    handleClose();
  };

  const getFilteredMessages = () => {
    if (tabValue === 1) return messages.filter(m => m.status === 'sent');
    if (tabValue === 2) return messages.filter(m => m.status === 'scheduled');
    return messages;
  };

  if (loadingMessages || loadingContacts) {
    return <div className="flex justify-center p-8"><CircularProgress /></div>;
  }

  const filteredMessages = getFilteredMessages();

  return (
    <div>
      <div className="flex items-center mb-6">
        <IconButton onClick={() => navigate('/connections')} className="mr-4">
          <ArrowLeft />
        </IconButton>
        <Typography variant="h4" className="flex-1 font-bold">Mensagens</Typography>
        <Button 
          variant="contained" 
          startIcon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpen()}
        >
          Nova Mensagem
        </Button>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)}>
          <Tab label="Todas" />
          <Tab label="Enviadas" />
          <Tab label="Agendadas" />
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMessages.length === 0 ? (
          <div className="col-span-full py-8 text-center text-gray-500">
            Nenhuma mensagem encontrada nesta categoria.
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <Card key={msg.id} className="shadow-sm">
              <CardContent>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    {msg.status === 'sent' ? (
                      <span className="flex items-center text-green-600 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Enviada
                      </span>
                    ) : (
                      <span className="flex items-center text-orange-500 text-sm font-medium">
                        <Clock className="w-4 h-4 mr-1" /> Agendada para {new Date(msg.scheduledFor!).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <IconButton size="small" onClick={() => deleteMut.mutate(msg.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </IconButton>
                </div>
                <Typography variant="body1" className="mb-4 text-gray-800">
                  {msg.content}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Enviado para {msg.contactIds.length} contato(s)
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Nova Mensagem</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2">
            <FormControl fullWidth>
              <InputLabel>Contatos</InputLabel>
              <Select
                multiple
                value={selectedContacts}
                onChange={(e) => setSelectedContacts(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                input={<OutlinedInput label="Contatos" />}
                renderValue={(selected) => selected.map(id => contacts.find(c => c.id === id)?.name).join(', ')}
              >
                {contacts.map((contact) => (
                  <MenuItem key={contact.id} value={contact.id}>
                    <Checkbox checked={selectedContacts.indexOf(contact.id) > -1} />
                    <ListItemText primary={contact.name} secondary={contact.phone} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Mensagem"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <TextField
              label="Agendar para (Opcional)"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={!content.trim() || selectedContacts.length === 0 || createMut.isPending}
          >
            {scheduledFor ? 'Agendar' : 'Enviar Agora'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
