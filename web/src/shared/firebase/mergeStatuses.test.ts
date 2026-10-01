import { describe, expect, it } from 'vitest';
import { mergeStatuses } from './useRealtimeQuery';

describe('mergeStatuses', () => {
  it('is ready only when every listener is ready', () => {
    expect(mergeStatuses(['ready', 'ready'])).toBe('ready');
  });

  it('waits while any listener is loading', () => {
    expect(mergeStatuses(['ready', 'loading'])).toBe('loading');
  });

  it('reports an error even if another listener is still loading', () => {
    expect(mergeStatuses(['loading', 'error'])).toBe('error');
  });
});
