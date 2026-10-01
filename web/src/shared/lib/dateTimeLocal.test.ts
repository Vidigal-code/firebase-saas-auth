import { describe, expect, it } from 'vitest';
import { parseDateTimeLocal, toDateTimeLocalValue } from './dateTimeLocal';

describe('dateTimeLocal', () => {
  it('formats a date as the value of a datetime-local input in local time', () => {
    expect(toDateTimeLocalValue(new Date(2026, 9, 1, 9, 5))).toBe('2026-10-01T09:05');
  });

  it('parses the input value back as local time', () => {
    expect(parseDateTimeLocal('2026-10-01T09:05')).toEqual(new Date(2026, 9, 1, 9, 5));
  });

  it.each(['', 'not-a-date', '2026-13-45T99:99'])('rejects invalid input %j', (value) => {
    expect(parseDateTimeLocal(value)).toBeNull();
  });
});
