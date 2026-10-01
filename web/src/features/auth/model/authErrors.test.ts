import { FirebaseError } from 'firebase/app';
import { describe, expect, it } from 'vitest';
import { toAuthErrorKey } from './authErrors';

const firebaseError = (code: string) => new FirebaseError(code, 'Firebase failure');

describe('toAuthErrorKey', () => {
  it.each([
    ['auth/invalid-credential', 'auth.errors.invalidCredentials'],
    ['auth/wrong-password', 'auth.errors.invalidCredentials'],
    ['auth/user-not-found', 'auth.errors.invalidCredentials'],
    ['auth/email-already-in-use', 'auth.errors.emailInUse'],
    ['auth/weak-password', 'auth.errors.weakPassword'],
    ['auth/too-many-requests', 'auth.errors.tooManyRequests'],
    ['auth/network-request-failed', 'auth.errors.network'],
  ])('maps %s to a friendly message', (code, key) => {
    expect(toAuthErrorKey(firebaseError(code))).toBe(key);
  });

  it('falls back to a generic message for unknown failures', () => {
    expect(toAuthErrorKey(firebaseError('auth/internal-error'))).toBe('auth.errors.unknown');
    expect(toAuthErrorKey(new Error('boom'))).toBe('auth.errors.unknown');
  });
});
