import {
  Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
} from '@mui/material';
import { useLang } from '@/shared/hooks/useLang';

interface Props {
  open: boolean;
  isEdit: boolean;
  name: string;
  isPending: boolean;
  onNameChange: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export const ConnectionDialog = ({ open, isEdit, name, isPending, onNameChange, onClose, onSave }: Props) => {
  const { t } = useLang();

  const title = isEdit ? t.connections.dialogEdit : t.connections.dialogCreate;
  const saveLabel = isPending ? t.common.saving : t.common.save;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={t.connections.nameLabel}
          fullWidth
          value={name}
          onChange={e => onNameChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSave()}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="text">{t.common.cancel}</Button>
        <Button onClick={onSave} variant="contained" disabled={!name.trim() || isPending}>
          {saveLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
