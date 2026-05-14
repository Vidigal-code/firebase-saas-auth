import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useConnections } from '@/entities/connection/model/hooks';
import { createConnection, updateConnection, deleteConnection } from '@/entities/connection/api';
import { useAppSelector } from '@/shared/hooks/redux';
import { 
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  Card, CardContent, Typography, IconButton, CircularProgress
} from '@mui/material';
import { Plus, Edit, Trash2, Users, MessageSquare } from 'lucide-react';

export const ConnectionsPage = () => {
  const { connections, loading } = useConnections();
  const { user } = useAppSelector(state => state.user);
  const navigate = useNavigate();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');

  const createMut = useMutation({
    mutationFn: (newName: string) => createConnection(user!.uid, newName)
  });

  const updateMut = useMutation({
    mutationFn: ({ id, newName }: { id: string, newName: string }) => updateConnection(id, newName)
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteConnection(id)
  });

  const handleOpen = (id?: string, currentName?: string) => {
    if (id && currentName) {
      setEditId(id);
      setName(currentName);
    } else {
      setEditId(null);
      setName('');
    }
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setName('');
    setEditId(null);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    
    if (editId) {
      await updateMut.mutateAsync({ id: editId, newName: name });
    } else {
      await createMut.mutateAsync(name);
    }
    handleClose();
  };

  if (loading) return <div className="flex justify-center p-8"><CircularProgress /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold">Conexões</Typography>
        <Button 
          variant="contained" 
          startIcon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpen()}
        >
          Nova Conexão
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((conn) => (
          <Card key={conn.id} className="hover:shadow-lg transition-shadow">
            <CardContent>
              <div className="flex justify-between items-start mb-4">
                <Typography variant="h6" className="font-semibold text-gray-800">
                  {conn.name}
                </Typography>
                <div className="flex space-x-1">
                  <IconButton size="small" onClick={() => handleOpen(conn.id, conn.name)}>
                    <Edit className="w-4 h-4 text-gray-500" />
                  </IconButton>
                  <IconButton size="small" onClick={() => deleteMut.mutate(conn.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </IconButton>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button 
                  size="small" 
                  variant="outlined" 
                  startIcon={<Users className="w-4 h-4" />}
                  onClick={() => navigate(`/connections/${conn.id}/contacts`)}
                >
                  Contatos
                </Button>
                <Button 
                  size="small" 
                  variant="outlined" 
                  color="secondary"
                  startIcon={<MessageSquare className="w-4 h-4" />}
                  onClick={() => navigate(`/connections/${conn.id}/messages`)}
                >
                  Mensagens
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {connections.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Você não possui nenhuma conexão ainda.
        </div>
      )}

      <Dialog open={openDialog} onClose={handleClose}>
        <DialogTitle>{editId ? 'Editar Conexão' : 'Nova Conexão'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Conexão"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" disabled={!name.trim() || createMut.isPending || updateMut.isPending}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
