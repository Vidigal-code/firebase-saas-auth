import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, Box } from '@mui/material';
import { useUpdatePassword } from '../model/useUpdatePassword';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const UpdatePasswordDialog = ({ open, onClose }: Props) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { loading, error, success, handleUpdate, resetState } = useUpdatePassword();

  useEffect(() => {
    if (open) {
      setOldPassword('');
      setNewPassword('');
      resetState();
    }
  }, [open]);

  const onSubmit = () => handleUpdate(oldPassword, newPassword, onClose);

  const isDisabled = loading || !oldPassword || !newPassword;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Alterar Senha</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
          <TextField label="Senha Antiga" type="password" fullWidth value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
          <TextField label="Nova Senha"   type="password" fullWidth value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="text">Cancelar</Button>
        <Button onClick={onSubmit} variant="contained" disabled={isDisabled}>
          {loading ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
