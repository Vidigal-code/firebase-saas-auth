import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LANG_SETTING } from '@/shared/config/env';
import { readPreference, writePreference } from '@/shared/lib/storage';
import { I18nContext, type I18nContextValue } from './i18nContext';
import { LANGUAGE_LOCALES, resolveLanguage, translate, type Language } from './translate';

const LANGUAGE_STORAGE_KEY = 'broadcastapp:lang';
const LANGUAGE_QUERY_PARAM = 'lang';
const DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = { dateStyle: 'short', timeStyle: 'short' };

const detectInitialLanguage = () =>
  resolveLanguage([
    new URLSearchParams(globalThis.location.search).get(LANGUAGE_QUERY_PARAM),
    readPreference(LANGUAGE_STORAGE_KEY),
    DEFAULT_LANG_SETTING,
    globalThis.navigator.language,
  ]);

export const I18nProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  const [language, setLanguage] = useState<Language>(detectInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = LANGUAGE_LOCALES[language];
  }, [language]);

  const changeLanguage = useCallback((next: Language) => {
    writePreference(LANGUAGE_STORAGE_KEY, next);
    setLanguage(next);
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const dateTimeFormatter = new Intl.DateTimeFormat(LANGUAGE_LOCALES[language], DATE_TIME_FORMAT);
    return {
      language,
      setLanguage: changeLanguage,
      t: (key, params) => translate(language, key, params),
      formatDateTime: (date) => dateTimeFormatter.format(date),
    };
  }, [language, changeLanguage]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
