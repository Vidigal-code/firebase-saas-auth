import { useState, useCallback } from 'react';

interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

const INITIAL_STATE: ConfirmDialogState = {
  open: false,
  title: '',
  message: '',
  onConfirm: () => {},
};

export const useConfirmDialog = () => {
  const [state, setState] = useState<ConfirmDialogState>(INITIAL_STATE);

  const requestConfirm = useCallback(
    (title: string, message: string, onConfirm: () => void) => {
      setState({ open: true, title, message, onConfirm });
    },
    [],
  );

  const closeConfirm = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const handleConfirm = useCallback(() => {
    state.onConfirm();
    closeConfirm();
  }, [state, closeConfirm]);

  return {
    confirmState: state,
    requestConfirm,
    closeConfirm,
    handleConfirm,
  };
};
