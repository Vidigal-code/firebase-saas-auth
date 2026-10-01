import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import { Controller, useForm, useWatch } from 'react-hook-form';
import type { Contact } from '@/entities/contact/model/types';
import { createMessage, updateMessage } from '@/entities/message/api/messagesRepository';
import { canChangeDelivery } from '@/entities/message/model/delivery';
import {
  createMessageFormSchema,
  type MessageFormInput,
  type MessageFormValues,
} from '@/entities/message/model/messageForm';
import type { Message } from '@/entities/message/model/types';
import { ScheduledDispatchNotice } from '@/entities/message/ui/ScheduledDispatchNotice';
import { MAX_RECIPIENTS, MESSAGE_MAX_LENGTH } from '@/shared/domain/limits';
import type { ConnectionScope } from '@/shared/domain/scope';
import { useFieldError } from '@/shared/i18n/useFieldError';
import { useTranslation } from '@/shared/i18n/useTranslation';
import type { TranslationKey } from '@/shared/i18n/translate';
import { toDateTimeLocalValue } from '@/shared/lib/dateTimeLocal';
import { FormDialog } from '@/shared/ui/FormDialog';
import { useDialogSubmit } from '@/shared/ui/useDialogSubmit';
import { buildFormDefaults } from '../model/formDefaults';
import { DeliveryField } from './DeliveryField';
import { RecipientsField } from './RecipientsField';

const messageFormSchema = createMessageFormSchema(() => new Date());
const CONTENT_ROWS = 4;

export interface MessageFormDialogProps {
  scope: ConnectionScope;
  contacts: Contact[];
  message: Message | null;
  onClose: () => void;
}

const resolveSuccessKey = (message: Message | null, values: MessageFormValues): TranslationKey => {
  if (message) return 'broadcast.updated';
  return values.delivery === 'now' ? 'broadcast.sentToast' : 'broadcast.scheduledToast';
};

const resolveSubmitKey = (message: Message | null, delivery: MessageFormInput['delivery']): TranslationKey => {
  if (message) return 'broadcast.saveChanges';
  return delivery === 'now' ? 'broadcast.sendNow' : 'broadcast.schedule';
};

export const MessageFormDialog = ({ scope, contacts, message, onClose }: Readonly<MessageFormDialogProps>) => {
  const { t } = useTranslation();
  const fieldError = useFieldError();
  const { control, register, handleSubmit, formState } = useForm<MessageFormInput, unknown, MessageFormValues>({
    resolver: zodResolver(messageFormSchema),
    defaultValues: buildFormDefaults(
      message,
      contacts.map((contact) => contact.id),
    ),
  });
  const { errors } = formState;
  const [delivery, content] = useWatch({ control, name: ['delivery', 'content'] });
  const { submit, isPending, errorMessage } = useDialogSubmit<MessageFormValues>({
    save: (values) => (message ? updateMessage(message, values) : createMessage(scope, values)),
    successMessage: (values) => t(resolveSuccessKey(message, values)),
    onClose,
  });
  const showDelivery = !message || canChangeDelivery(message.status);
  const isScheduling = showDelivery && delivery === 'schedule';

  return (
    <FormDialog
      title={t(message ? 'broadcast.editTitle' : 'broadcast.createTitle')}
      submitLabel={t(resolveSubmitKey(message, delivery))}
      isPending={isPending}
      errorMessage={errorMessage}
      maxWidth="sm"
      onSubmit={handleSubmit(submit)}
      onClose={onClose}
    >
      {!showDelivery && <Alert severity="info">{t('broadcast.sentEditHint')}</Alert>}
      <Controller
        control={control}
        name="contactIds"
        render={({ field, fieldState }) => (
          <RecipientsField
            contacts={contacts}
            value={field.value}
            onChange={field.onChange}
            errorText={fieldError(fieldState.error, { max: MAX_RECIPIENTS })}
          />
        )}
      />
      <TextField
        label={t('broadcast.contentLabel')}
        multiline
        minRows={CONTENT_ROWS}
        slotProps={{ htmlInput: { maxLength: MESSAGE_MAX_LENGTH } }}
        {...register('content')}
        error={Boolean(errors.content)}
        helperText={
          fieldError(errors.content, { max: MESSAGE_MAX_LENGTH }) ??
          t('broadcast.contentCounter', { count: content.length, max: MESSAGE_MAX_LENGTH })
        }
      />
      {showDelivery && (
        <Controller
          control={control}
          name="delivery"
          render={({ field }) => <DeliveryField value={field.value} onChange={field.onChange} />}
        />
      )}
      {isScheduling && (
        <>
          <ScheduledDispatchNotice />
          <TextField
            label={t('broadcast.scheduleLabel')}
            type="datetime-local"
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: toDateTimeLocalValue(new Date()) } }}
            {...register('scheduledAt')}
            error={Boolean(errors.scheduledAt)}
            helperText={fieldError(errors.scheduledAt)}
          />
        </>
      )}
    </FormDialog>
  );
};
