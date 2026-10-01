import { describe, expect, it } from 'vitest';
import { NAME_MAX_LENGTH } from '@/shared/domain/limits';
import { contactFormSchema } from './types';

const messagesOf = (input: { name: string; phone: string }) => {
  const result = contactFormSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
};

describe('contact form schema', () => {
  it('trims the name and normalizes the phone', () => {
    expect(contactFormSchema.parse({ name: ' Ana ', phone: '+55 (11) 98888-7777' })).toEqual({
      name: 'Ana',
      phone: '+5511988887777',
    });
  });

  it('requires a name within the allowed length', () => {
    expect(messagesOf({ name: ' ', phone: '1133334444' })).toEqual(['validation.required']);
    expect(messagesOf({ name: 'x'.repeat(NAME_MAX_LENGTH + 1), phone: '1133334444' })).toEqual([
      'validation.maxLength',
    ]);
  });

  it('rejects invalid phones', () => {
    expect(messagesOf({ name: 'Ana', phone: '123' })).toEqual(['validation.phone']);
  });
});
