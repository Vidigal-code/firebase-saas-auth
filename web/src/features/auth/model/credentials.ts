import { z } from 'zod';
import { withMessage } from '@/shared/domain/validationMessage';

const PASSWORD_POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const emailSchema = z.string().trim().toLowerCase().pipe(z.email(withMessage('validation.email')));
const requiredPassword = z.string().min(1, withMessage('validation.required'));
const strongPassword = z.string().regex(PASSWORD_POLICY, withMessage('validation.passwordPolicy'));

export const loginSchema = z.object({ email: emailSchema, password: requiredPassword });
export const registerSchema = z.object({ email: emailSchema, password: strongPassword });
export const changePasswordSchema = z.object({ currentPassword: requiredPassword, newPassword: strongPassword });

export type Credentials = z.output<typeof loginSchema>;
export type PasswordChange = z.output<typeof changePasswordSchema>;
