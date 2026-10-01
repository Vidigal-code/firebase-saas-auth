import { z } from 'zod';
import { nameSchema } from '@/shared/domain/nameSchema';
import { withMessage } from '@/shared/domain/validationMessage';
import { isValidPhone, normalizePhone } from './phone';

export interface Contact {
  id: string;
  connectionId: string;
  name: string;
  phone: string;
}

export const contactFormSchema = z.object({
  name: nameSchema,
  phone: z.string().transform(normalizePhone).refine(isValidPhone, withMessage('validation.phone')),
});

export type ContactFormInput = z.input<typeof contactFormSchema>;
export type ContactFormValues = z.output<typeof contactFormSchema>;
