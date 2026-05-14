import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createConnection, updateConnection, deleteConnection } from '@/entities/connection/api';
import { useCurrentUser } from '@/shared/hooks/useCurrentUser';
import { useConfirmDialog } from '@/shared/hooks/useConfirmDialog';

interface DialogState {
  open: boolean;
  editId: string | null;
  name: string;
}

const INITIAL_DIALOG: DialogState = { open: false, editId: null, name: '' };

export const useConnectionCrud = () => {
  const { uid } = useCurrentUser();
  const confirm = useConfirmDialog();
  const [dialog, setDialog] = useState<DialogState>(INITIAL_DIALOG);

  const createMut = useMutation({
    mutationFn: (name: string) => createConnection(uid!, name),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, newName }: { id: string; newName: string }) => updateConnection(id, newName),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteConnection(id),
  });

  const openCreate = useCallback(
    () => setDialog({ open: true, editId: null, name: '' }),
    [],
  );

  const openEdit = useCallback(
    (id: string, currentName: string) => setDialog({ open: true, editId: id, name: currentName }),
    [],
  );

  const closeDialog = useCallback(
    () => setDialog(INITIAL_DIALOG),
    [],
  );

  const setName = useCallback(
    (name: string) => setDialog(prev => ({ ...prev, name })),
    [],
  );

  const save = useCallback(async () => {
    const trimmed = dialog.name.trim();
    if (!trimmed || !uid) return;

    if (dialog.editId) {
      await updateMut.mutateAsync({ id: dialog.editId, newName: trimmed });
    } else {
      await createMut.mutateAsync(trimmed);
    }

    closeDialog();
  }, [dialog.name, dialog.editId, uid, updateMut, createMut, closeDialog]);

  const requestDelete = useCallback(
    (id: string, connName: string) => {
      confirm.requestConfirm(
        'Excluir Conexao',
        `Tem certeza que deseja excluir a conexao "${connName}"? Essa acao nao pode ser desfeita.`,
        () => deleteMut.mutate(id),
      );
    },
    [confirm, deleteMut],
  );

  const isPending = createMut.isPending || updateMut.isPending;

  return {
    dialog,
    isPending,
    openCreate,
    openEdit,
    closeDialog,
    setName,
    save,
    requestDelete,
    confirm,
  };
};
