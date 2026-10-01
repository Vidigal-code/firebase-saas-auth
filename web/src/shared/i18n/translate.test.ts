import { describe, expect, it } from 'vitest';
import { resolveLanguage, translate } from './translate';

describe('translate', () => {
  it('resolves nested keys of the active dictionary', () => {
    expect(translate('en', 'broadcast.filters.scheduled')).toBe('Scheduled');
    expect(translate('pt', 'broadcast.filters.scheduled')).toBe('Agendadas');
  });

  it('interpolates every placeholder occurrence', () => {
    expect(translate('en', 'broadcast.contentCounter', { count: 12, max: 1000 })).toBe('12/1000');
  });

  it('keeps unknown placeholders visible instead of hiding missing data', () => {
    expect(translate('en', 'connections.createdAt')).toBe('Created on {date}');
  });
});

describe('resolveLanguage', () => {
  it('uses the first supported candidate', () => {
    expect(resolveLanguage([null, 'fr', 'es', 'en'])).toBe('es');
  });

  it('accepts regional browser tags', () => {
    expect(resolveLanguage(['en-US'])).toBe('en');
  });

  it('falls back to Portuguese', () => {
    expect(resolveLanguage([undefined, 'de'])).toBe('pt');
  });
});
