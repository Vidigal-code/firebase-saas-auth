import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useContacts } from '@/entities/contact/model/hooks';
import { createContact, updateContact, deleteContact } from '@/entities/contact/api';
import { useAppSelector } from '@/shared/hooks/redux';
import { 
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, CircularProgress, Typography
} from '@mui/material';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';

export const ContactsPage = () => {
  const { connectionId } = useParams<{ connectionId: string }>();
  const navigate = useNavigate();
  const { contacts, loading } = useContacts(connectionId!);
  const { user } = useAppSelector(state => state.user);
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const createMut = useMutation({
    mutationFn: ({ name, phone }: { name: string, phone: string }) => 
      createContact(user!.uid, connectionId!, name, phone)
  });

  const updateMut = useMutation({
    mutationFn: ({ id, name, phone }: { id: string, name: string, phone: string }) => 
      updateContact(id, name, phone)
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteContact(id)
  });

  const handleOpen = (id?: string, currentName?: string, currentPhone?: string) => {
    if (id && currentName && currentPhone) {
      setEditId(id);
      setName(currentName);
      setPhone(currentPhone);
    } else {
      setEditId(null);
      setName('');
      setPhone('');
    }
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setName('');
    setPhone('');
    setEditId(null);
  };

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) return;
    
    if (editId) {
      await updateMut.mutateAsync({ id: editId, name, phone });
    } else {
      await createMut.mutateAsync({ name, phone });
    }
    handleClose();
  };

  if (loading) return <div className="flex justify-center p-8"><CircularProgress /></div>;

  return (
    <div>
      <div className="flex items-center mb-6">
        <IconButton onClick={() => navigate('/connections')} className="mr-4">
          <ArrowLeft />
        </IconButton>
        <Typography variant="h4" className="flex-1 font-bold">Contatos da Conexão</Typography>
        <Button 
          variant="contained" 
          startIcon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpen()}
        >
          Novo Contato
        </Button>
      </div>

      <TableContainer component={Paper} className="shadow-sm">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableCell><strong>Nome</strong></TableCell>
              <TableCell><strong>Telefone</strong></TableCell>
              <TableCell align="right"><strong>Ações</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" className="py-8 text-gray-500">
                  Nenhum contato encontrado.
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => (
                <TableRow key={contact.id} hover>
                  <TableCell>{contact.name}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpen(contact.id, contact.name, contact.phone)}>
                      <Edit className="w-4 h-4 text-gray-500" />
                    </IconButton>
                    <IconButton size="small" onClick={() => deleteMut.mutate(contact.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{editId ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2">
            <TextField
              autoFocus
              label="Nome"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Telefone"
              type="text"
              fullWidth
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={!name.trim() || !phone.trim() || createMut.isPending || updateMut.isPending}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
