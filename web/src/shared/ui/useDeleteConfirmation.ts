import { useState } from 'react';
import { useAsyncAction } from '@/shared/hooks/useAsyncAction';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { ConfirmDialogProps } from './ConfirmDialog';
import { useNotify } from './notifications/useNotify';

export interface DeleteConfirmationOptions<T> {
  remove: (item: T) => Promise<unknown>;
  describe: (item: T) => { title: string; message: string };
  successMessage: string;
}

export interface DeleteConfirmation<T> {
  request: (item: T) => void;
  dialogProps: ConfirmDialogProps;
}

interface Target<T> {
  item: T;
  open: boolean;
}

const NO_TEXTS = { title: '', message: '' };

export const useDeleteConfirmation = <T>({
  remove,
  describe,
  successMessage,
}: DeleteConfirmationOptions<T>): DeleteConfirmation<T> => {
  const { t } = useTranslation();
  const notify = useNotify();
  // The item is kept after closing so the dialog text survives its exit transition.
  const [target, setTarget] = useState<Target<T> | null>(null);
  const action = useAsyncAction(remove);

  const close = () => setTarget((current) => current && { ...current, open: false });

  const confirm = async () => {
    if (!target) return;
    const outcome = await action.run(target.item);
    close();
    if (outcome.ok) notify.success(successMessage);
    else notify.error(t('common.deleteError'));
  };

  return {
    request: (item) => setTarget({ item, open: true }),
    dialogProps: {
      open: target?.open ?? false,
      ...(target ? describe(target.item) : NO_TEXTS),
      isPending: action.isPending,
      onConfirm: () => void confirm(),
      onCancel: close,
    },
  };
};
