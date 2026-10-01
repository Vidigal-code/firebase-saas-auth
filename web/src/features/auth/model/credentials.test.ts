import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from './credentials';

const firstMessage = (result: { success: boolean; error?: { issues: { message: string }[] } }) =>
  result.error?.issues[0]?.message;

describe('credentials schemas', () => {
  it('normalizes the email on login', () => {
    expect(loginSchema.parse({ email: ' Ana@Example.com ', password: 'x' })).toEqual({
      email: 'ana@example.com',
      password: 'x',
    });
  });

  it('rejects malformed emails', () => {
    expect(firstMessage(loginSchema.safeParse({ email: 'ana@', password: 'x' }))).toBe('validation.email');
  });

  it('enforces the password policy on registration', () => {
    expect(registerSchema.safeParse({ email: 'ana@example.com', password: 'Str0ng!Pass' }).success).toBe(true);
    expect(firstMessage(registerSchema.safeParse({ email: 'ana@example.com', password: 'weakpass' }))).toBe(
      'validation.passwordPolicy',
    );
  });
});
