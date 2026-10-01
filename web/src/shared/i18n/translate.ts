import en from './locales/en.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import { isOneOf } from '@/shared/lib/isOneOf';

export const LANGUAGES = ['pt', 'en', 'es'] as const;
export type Language = (typeof LANGUAGES)[number];

export const FALLBACK_LANGUAGE: Language = 'pt';

export const LANGUAGE_LOCALES: Record<Language, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
};

type Dictionary = typeof pt;

const DICTIONARIES: Record<Language, Dictionary> = { pt, en, es };

type LeafPaths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${LeafPaths<T[K]>}`;
}[keyof T & string];

export type TranslationKey = LeafPaths<Dictionary>;
export type TranslationParams = Record<string, string | number>;

const PLACEHOLDER_PATTERN = /\{(\w+)\}/g;

const lookup = (dictionary: Dictionary, key: TranslationKey): string =>
  key.split('.').reduce<unknown>((node, segment) => (node as Record<string, unknown>)[segment], dictionary) as string;

const interpolate = (template: string, params: TranslationParams) =>
  template.replaceAll(PLACEHOLDER_PATTERN, (placeholder, name: string) =>
    name in params ? String(params[name]) : placeholder,
  );

export const translate = (language: Language, key: TranslationKey, params: TranslationParams = {}): string =>
  interpolate(lookup(DICTIONARIES[language], key), params);

const toBaseLanguage = (tag: string) => tag.toLowerCase().split('-')[0];

const isLanguage = (value: string): value is Language => isOneOf(LANGUAGES, value);

export const resolveLanguage = (candidates: ReadonlyArray<string | null | undefined>): Language =>
  candidates
    .filter((candidate): candidate is string => Boolean(candidate))
    .map(toBaseLanguage)
    .find(isLanguage) ?? FALLBACK_LANGUAGE;
