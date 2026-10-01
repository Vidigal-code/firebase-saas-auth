import type { DocumentData } from 'firebase/firestore';
import { isOneOf } from '@/shared/lib/isOneOf';

// Typed readers for snapshot data at the Firestore boundary. Documents are
// validated by firestore.rules on write, so fallbacks only cover pending/legacy data.
export const readString = (data: DocumentData, field: string): string => {
  const value: unknown = data[field];
  return typeof value === 'string' ? value : '';
};

export const readStringList = (data: DocumentData, field: string): string[] => {
  const value: unknown = data[field];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
};

export const readOneOf = <T extends string>(data: DocumentData, field: string, allowed: readonly T[]): T => {
  const value = readString(data, field);
  return isOneOf(allowed, value) ? value : allowed[0];
};
