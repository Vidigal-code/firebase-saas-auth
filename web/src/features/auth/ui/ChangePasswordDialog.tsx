import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { useFieldError } from '@/shared/i18n/useFieldError';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { FormDialog } from '@/shared/ui/FormDialog';
import { useDialogSubmit } from '@/shared/ui/useDialogSubmit';
import { toAuthErrorKey } from '../model/authErrors';
import { changePassword } from '../model/authService';
import { changePasswordSchema, type PasswordChange } from '../model/credentials';

const EMPTY_FORM: PasswordChange = { currentPassword: '', newPassword: '' };

export const ChangePasswordDialog = ({ onClose }: Readonly<{ onClose: () => void }>) => {
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordChange>({ resolver: zodResolver(changePasswordSchema), defaultValues: EMPTY_FORM });
  const { submit, isPending, errorMessage } = useDialogSubmit<PasswordChange>({
    save: changePassword,
    successMessage: () => t('auth.passwordChanged'),
    onClose,
    describeError: (error) => t(toAuthErrorKey(error)),
  });

  return (
    <FormDialog
      title={t('auth.changePasswordTitle')}
      submitLabel={t('auth.changePasswordButton')}
      isPending={isPending}
      errorMessage={errorMessage}
      onSubmit={handleSubmit(submit)}
      onClose={onClose}
    >
      <TextField
        label={t('auth.currentPassword')}
        type="password"
        autoComplete="current-password"
        {...register('currentPassword')}
        error={Boolean(errors.currentPassword)}
        helperText={fieldError(errors.currentPassword)}
      />
      <TextField
        label={t('auth.newPassword')}
        type="password"
        autoComplete="new-password"
        {...register('newPassword')}
        error={Boolean(errors.newPassword)}
        helperText={fieldError(errors.newPassword) ?? t('auth.passwordHint')}
      />
    </FormDialog>
  );
};
