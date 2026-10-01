import { z } from 'zod';
import { NAME_MAX_LENGTH } from './limits';
import { withMessage } from './validationMessage';

export const nameSchema = z
  .string()
  .trim()
  .min(1, withMessage('validation.required'))
  .max(NAME_MAX_LENGTH, withMessage('validation.maxLength'));
