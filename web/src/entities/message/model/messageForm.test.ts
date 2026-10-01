import { describe, expect, it } from 'vitest';
import { MAX_RECIPIENTS, MESSAGE_MAX_LENGTH } from '@/shared/domain/limits';
import { createMessageFormSchema, type MessageFormInput } from './messageForm';

const NOW = new Date(2026, 9, 1, 12, 0);
const schema = createMessageFormSchema(() => NOW);

const VALID_INPUT: MessageFormInput = {
  contactIds: ['c1'],
  content: '  Promo today  ',
  delivery: 'now',
  scheduledAt: '',
};

const issuesOf = (input: MessageFormInput) => {
  const result = schema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => `${issue.path.join('.')}:${issue.message}`);
};

describe('message form schema', () => {
  it('accepts an immediate message and trims its content', () => {
    const result = schema.parse(VALID_INPUT);

    expect(result).toEqual({ contactIds: ['c1'], content: 'Promo today', delivery: 'now', scheduledAt: null });
  });

  it('converts a future schedule into a date', () => {
    const result = schema.parse({ ...VALID_INPUT, delivery: 'schedule', scheduledAt: '2026-10-01T12:30' });

    expect(result.scheduledAt).toEqual(new Date(2026, 9, 1, 12, 30));
  });

  it('requires at least one recipient and respects the recipient limit', () => {
    expect(issuesOf({ ...VALID_INPUT, contactIds: [] })).toEqual(['contactIds:validation.recipientsRequired']);
    const tooMany = Array.from({ length: MAX_RECIPIENTS + 1 }, (_, index) => `c${index}`);
    expect(issuesOf({ ...VALID_INPUT, contactIds: tooMany })).toEqual(['contactIds:validation.recipientsMax']);
  });

  it('rejects blank and oversized content', () => {
    expect(issuesOf({ ...VALID_INPUT, content: '   ' })).toEqual(['content:validation.required']);
    expect(issuesOf({ ...VALID_INPUT, content: 'x'.repeat(MESSAGE_MAX_LENGTH + 1) })).toEqual([
      'content:validation.maxLength',
    ]);
  });

  it('requires a schedule date when scheduling', () => {
    expect(issuesOf({ ...VALID_INPUT, delivery: 'schedule', scheduledAt: '' })).toEqual([
      'scheduledAt:validation.scheduleRequired',
    ]);
  });

  it('rejects schedules that are not in the future', () => {
    expect(issuesOf({ ...VALID_INPUT, delivery: 'schedule', scheduledAt: '2026-10-01T12:00' })).toEqual([
      'scheduledAt:validation.scheduleInPast',
    ]);
  });

  it('ignores a leftover schedule value when sending now', () => {
    expect(schema.parse({ ...VALID_INPUT, scheduledAt: '2020-01-01T00:00' }).scheduledAt).toBeNull();
  });
});
