import {
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';

interface Props {
  open: boolean;
  isEdit: boolean;
  name: string;
  isPending: boolean;
  onNameChange: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const DIALOG_TITLES = { create: 'Nova Conexao', edit: 'Editar Conexao' } as const;
const SAVE_LABELS = { idle: 'Salvar', pending: 'Salvando...' } as const;

const resolveTitle = (isEdit: boolean) => isEdit ? DIALOG_TITLES.edit : DIALOG_TITLES.create;
const resolveSaveLabel = (isPending: boolean) => isPending ? SAVE_LABELS.pending : SAVE_LABELS.idle;

export const ConnectionDialog = ({ open, isEdit, name, isPending, onNameChange, onClose, onSave }: Props) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle>{resolveTitle(isEdit)}</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Nome da Conexao"
        fullWidth
        value={name}
        onChange={e => onNameChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSave()}
      />
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2 }}>
      <Button onClick={onClose} variant="text">Cancelar</Button>
      <Button onClick={onSave} variant="contained" disabled={!name.trim() || isPending}>
        {resolveSaveLabel(isPending)}
      </Button>
    </DialogActions>
  </Dialog>
);
