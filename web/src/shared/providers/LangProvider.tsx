import { createContext, useState, useMemo, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  type Lang,
  type Translations,
  LANG_STORAGE_KEY,
  resolveTranslations,
  validateLang,
} from '@/shared/config/i18n';
import { ENV } from '@/shared/config/env';

interface LangContextValue {
  lang: Lang;
  t: Translations;
  setLang: (lang: Lang) => void;
}

export const LangContext = createContext<LangContextValue>({
  lang: 'pt',
  t: resolveTranslations('pt'),
  setLang: () => {},
});

const resolveInitialLang = (): Lang => {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = validateLang(urlParams.get('lang'));
  if (urlLang) return urlLang;

  const saved = validateLang(localStorage.getItem(LANG_STORAGE_KEY));
  if (saved) return saved;

  return validateLang(ENV.START_LANG) || 'pt';
};

interface Props {
  children: ReactNode;
}

export const LangProvider = ({ children }: Props) => {
  const [lang, setLangState] = useState<Lang>(resolveInitialLang);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem(LANG_STORAGE_KEY, newLang);
  }, []);

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LangContextValue>(() => ({
    lang,
    t: resolveTranslations(lang),
    setLang,
  }), [lang, setLang]);

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
};
