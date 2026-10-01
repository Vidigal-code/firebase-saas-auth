import type { MessageFormInput } from '@/entities/message/model/messageForm';
import type { Message } from '@/entities/message/model/types';
import { toDateTimeLocalValue } from '@/shared/lib/dateTimeLocal';

const NEW_MESSAGE: MessageFormInput = { contactIds: [], content: '', delivery: 'now', scheduledAt: '' };

export const buildFormDefaults = (message: Message | null, existingContactIds: readonly string[]): MessageFormInput => {
  if (!message) return NEW_MESSAGE;

  return {
    contactIds: message.contactIds.filter((id) => existingContactIds.includes(id)),
    content: message.content,
    delivery: message.status === 'scheduled' ? 'schedule' : 'now',
    scheduledAt: message.scheduledAt ? toDateTimeLocalValue(message.scheduledAt) : '',
  };
};
