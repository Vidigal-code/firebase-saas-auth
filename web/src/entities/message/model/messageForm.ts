import { z } from 'zod';
import { MAX_RECIPIENTS, MESSAGE_MAX_LENGTH } from '@/shared/domain/limits';
import { withMessage } from '@/shared/domain/validationMessage';
import type { TranslationKey } from '@/shared/i18n/translate';
import { parseDateTimeLocal } from '@/shared/lib/dateTimeLocal';
import { DELIVERY_MODES } from './delivery';

const baseSchema = z.object({
  contactIds: z
    .array(z.string())
    .min(1, withMessage('validation.recipientsRequired'))
    .max(MAX_RECIPIENTS, withMessage('validation.recipientsMax')),
  content: z
    .string()
    .trim()
    .min(1, withMessage('validation.required'))
    .max(MESSAGE_MAX_LENGTH, withMessage('validation.maxLength')),
  delivery: z.enum(DELIVERY_MODES),
  scheduledAt: z.string(),
});

export type MessageFormInput = z.input<typeof baseSchema>;

type ScheduleIssueKey = Extract<TranslationKey, 'validation.scheduleRequired' | 'validation.scheduleInPast'>;

const rejectSchedule = (context: z.RefinementCtx, key: ScheduleIssueKey) => {
  context.addIssue({ code: 'custom', path: ['scheduledAt'], ...withMessage(key) });
  return z.NEVER;
};

export const createMessageFormSchema = (now: () => Date) =>
  baseSchema.transform((values, context) => {
    if (values.delivery === 'now') return { ...values, scheduledAt: null };

    const scheduledAt = parseDateTimeLocal(values.scheduledAt);
    if (!scheduledAt) return rejectSchedule(context, 'validation.scheduleRequired');
    if (scheduledAt <= now()) return rejectSchedule(context, 'validation.scheduleInPast');
    return { ...values, scheduledAt };
  });

export type MessageFormValues = z.output<ReturnType<typeof createMessageFormSchema>>;
