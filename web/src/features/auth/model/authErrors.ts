import { FirebaseError } from 'firebase/app';
import { AuthErrorCodes } from 'firebase/auth';
import type { TranslationKey } from '@/shared/i18n/translate';

const INVALID_CREDENTIAL_CODES = [
  AuthErrorCodes.INVALID_LOGIN_CREDENTIALS,
  AuthErrorCodes.INVALID_PASSWORD,
  AuthErrorCodes.USER_DELETED,
];

const AUTH_ERROR_KEYS: ReadonlyMap<string, TranslationKey> = new Map<string, TranslationKey>([
  ...INVALID_CREDENTIAL_CODES.map((code): [string, TranslationKey] => [code, 'auth.errors.invalidCredentials']),
  [AuthErrorCodes.EMAIL_EXISTS, 'auth.errors.emailInUse'],
  [AuthErrorCodes.WEAK_PASSWORD, 'auth.errors.weakPassword'],
  [AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER, 'auth.errors.tooManyRequests'],
  [AuthErrorCodes.NETWORK_REQUEST_FAILED, 'auth.errors.network'],
]);

const UNKNOWN_ERROR: TranslationKey = 'auth.errors.unknown';

export const toAuthErrorKey = (error: unknown): TranslationKey =>
  error instanceof FirebaseError ? (AUTH_ERROR_KEYS.get(error.code) ?? UNKNOWN_ERROR) : UNKNOWN_ERROR;
