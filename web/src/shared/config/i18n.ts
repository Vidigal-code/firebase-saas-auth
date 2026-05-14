import en from '@/shared/langs/en.json';
import pt from '@/shared/langs/pt.json';
import es from '@/shared/langs/es.json';

export type Lang = 'pt' | 'en' | 'es';

export type Translations = typeof pt;

const translations: Record<Lang, Translations> = { en, pt, es };

export const SUPPORTED_LANGS: Lang[] = ['pt', 'en', 'es'];

export const LANG_STORAGE_KEY = 'broadcastapp:lang';

const isValidLang = (value: string | null): value is Lang =>
  SUPPORTED_LANGS.includes(value as Lang);

export const resolveTranslations = (lang: Lang): Translations => translations[lang];

export const validateLang = (value: string | null): Lang | null =>
  value && isValidLang(value) ? value : null;

export default translations;
