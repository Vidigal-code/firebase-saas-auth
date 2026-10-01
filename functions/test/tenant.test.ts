import { describe, expect, it } from 'vitest';
import { readClientId } from '../src/domain/tenant';

const CLIENT_ID = 'client-a';
const DOCUMENTS_WITHOUT_OWNER = [undefined, {}, { clientId: '' }, { clientId: 42 }];

describe('readClientId', () => {
  it('returns the owner of a tenant document', () => {
    expect(readClientId({ clientId: CLIENT_ID })).toBe(CLIENT_ID);
  });

  it.each(DOCUMENTS_WITHOUT_OWNER)('rejects documents without a valid owner: %j', (data) => {
    expect(readClientId(data)).toBeNull();
  });
});
