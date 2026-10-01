import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import { useForm } from 'react-hook-form';
import { createContact, updateContact } from '@/entities/contact/api/contactsRepository';
import {
  contactFormSchema,
  type Contact,
  type ContactFormInput,
  type ContactFormValues,
} from '@/entities/contact/model/types';
import { NAME_MAX_LENGTH } from '@/shared/domain/limits';
import type { ConnectionScope } from '@/shared/domain/scope';
import { useFieldError } from '@/shared/i18n/useFieldError';
import { useTranslation } from '@/shared/i18n/useTranslation';
import { FormDialog } from '@/shared/ui/FormDialog';
import { useDialogSubmit } from '@/shared/ui/useDialogSubmit';

const PHONE_PLACEHOLDER = '+55 11 99999-8888';

export interface ContactFormDialogProps {
  scope: ConnectionScope;
  contact: Contact | null;
  onClose: () => void;
}

export const ContactFormDialog = ({ scope, contact, onClose }: Readonly<ContactFormDialogProps>) => {
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormInput, unknown, ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: contact?.name ?? '', phone: contact?.phone ?? '' },
  });
  const { submit, isPending, errorMessage } = useDialogSubmit<ContactFormValues>({
    save: (values) => (contact ? updateContact(contact.id, values) : createContact(scope, values)),
    successMessage: () => t(contact ? 'contacts.updated' : 'contacts.created'),
    onClose,
  });

  return (
    <FormDialog
      title={t(contact ? 'contacts.editTitle' : 'contacts.createTitle')}
      submitLabel={t('common.save')}
      isPending={isPending}
      errorMessage={errorMessage}
      onSubmit={handleSubmit(submit)}
      onClose={onClose}
    >
      <TextField
        label={t('contacts.nameLabel')}
        autoFocus
        autoComplete="name"
        slotProps={{ htmlInput: { maxLength: NAME_MAX_LENGTH } }}
        {...register('name')}
        error={Boolean(errors.name)}
        helperText={fieldError(errors.name, { max: NAME_MAX_LENGTH })}
      />
      <TextField
        label={t('contacts.phoneLabel')}
        type="tel"
        autoComplete="tel"
        placeholder={PHONE_PLACEHOLDER}
        {...register('phone')}
        error={Boolean(errors.phone)}
        helperText={fieldError(errors.phone)}
      />
    </FormDialog>
  );
};
