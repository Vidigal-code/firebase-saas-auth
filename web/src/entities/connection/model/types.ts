import { z } from 'zod';
import { nameSchema } from '@/shared/domain/nameSchema';

export interface Connection {
  id: string;
  name: string;
  createdAt: Date;
}

export const connectionFormSchema = z.object({ name: nameSchema });

export type ConnectionFormValues = z.output<typeof connectionFormSchema>;
