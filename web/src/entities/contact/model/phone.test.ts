import { describe, expect, it } from 'vitest';
import { isValidPhone, normalizePhone } from './phone';

describe('normalizePhone', () => {
  it('strips formatting and keeps the international prefix', () => {
    expect(normalizePhone(' +55 (11) 99999-8888 ')).toBe('+5511999998888');
  });

  it('keeps national numbers without a prefix', () => {
    expect(normalizePhone('11 3333.4444')).toBe('1133334444');
  });
});

describe('isValidPhone', () => {
  it.each(['+5511999998888', '1133334444', '+14155550100'])('accepts %s', (phone) => {
    expect(isValidPhone(phone)).toBe(true);
  });

  it.each(['', '+', '12345', '0113333444', '+1234567890123456', '11-3333-4444'])('rejects %j', (phone) => {
    expect(isValidPhone(phone)).toBe(false);
  });
});
