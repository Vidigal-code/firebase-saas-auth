import { PHONE_PATTERN } from '@/shared/domain/limits';

const INTERNATIONAL_PREFIX = '+';
const NON_DIGITS = /\D/g;

export const normalizePhone = (raw: string): string => {
  const trimmed = raw.trim();
  const digits = trimmed.replaceAll(NON_DIGITS, '');
  return trimmed.startsWith(INTERNATIONAL_PREFIX) ? `${INTERNATIONAL_PREFIX}${digits}` : digits;
};

export const isValidPhone = (phone: string): boolean => PHONE_PATTERN.test(phone);
