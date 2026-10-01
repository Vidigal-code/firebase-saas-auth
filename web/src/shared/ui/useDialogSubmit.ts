import { useAsyncAction } from '@/shared/hooks/useAsyncAction';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { useNotify } from './notifications/useNotify';

export interface DialogSubmitOptions<V> {
  save: (values: V) => Promise<unknown>;
  successMessage: (values: V) => string;
  onClose: () => void;
  describeError?: (error: unknown) => string;
}

export interface DialogSubmit<V> {
  submit: (values: V) => Promise<void>;
  isPending: boolean;
  errorMessage: string | null;
}

export const useDialogSubmit = <V>({
  save,
  successMessage,
  onClose,
  describeError,
}: DialogSubmitOptions<V>): DialogSubmit<V> => {
  const { t } = useTranslation();
  const notify = useNotify();
  const action = useAsyncAction(save);

  const submit = async (values: V) => {
    const outcome = await action.run(values);
    if (!outcome.ok) return;
    notify.success(successMessage(values));
    onClose();
  };

  const errorMessage = action.error ? (describeError?.(action.error) ?? t('common.saveError')) : null;

  return { submit, isPending: action.isPending, errorMessage };
};
