import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { createConnection, updateConnection } from '@/entities/connection/api/connectionsRepository';
import { connectionFormSchema, type Connection, type ConnectionFormValues } from '@/entities/connection/model/types';
import { useCurrentUser } from '@/entities/session/useSession';
import { NAME_MAX_LENGTH } from '@/shared/domain/limits';
import { useFieldError } from '@/shared/i18n/useFieldError';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { FormDialog } from '@/shared/ui/FormDialog';
import { useDialogSubmit } from '@/shared/ui/useDialogSubmit';

export interface ConnectionFormDialogProps {
  connection: Connection | null;
  onClose: () => void;
}

export const ConnectionFormDialog = ({ connection, onClose }: Readonly<ConnectionFormDialogProps>) => {
  const { uid } = useCurrentUser();
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionFormSchema),
    defaultValues: { name: connection?.name ?? '' },
  });
  const { submit, isPending, errorMessage } = useDialogSubmit<ConnectionFormValues>({
    save: (values) => (connection ? updateConnection(connection.id, values) : createConnection(uid, values)),
    successMessage: () => t(connection ? 'connections.updated' : 'connections.created'),
    onClose,
  });

  return (
    <FormDialog
      title={t(connection ? 'connections.editTitle' : 'connections.createTitle')}
      submitLabel={t('common.save')}
      isPending={isPending}
      errorMessage={errorMessage}
      onSubmit={handleSubmit(submit)}
      onClose={onClose}
    >
      <TextField
        label={t('connections.nameLabel')}
        autoFocus
        slotProps={{ htmlInput: { maxLength: NAME_MAX_LENGTH } }}
        {...register('name')}
        error={Boolean(errors.name)}
        helperText={fieldError(errors.name, { max: NAME_MAX_LENGTH })}
      />
    </FormDialog>
  );
};
