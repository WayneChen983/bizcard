
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, languages, DEFAULT_LANGUAGE, type Language } from '@/lib/i18n';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  languages: typeof languages;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  const storedLang = localStorage.getItem('language') as Language;
  if (storedLang && languages[storedLang]) {
    return storedLang;
  }

  const browserLang = navigator.language.split('-')[0];
  if (languages[browserLang as Language]) {
    return browserLang as Language;
  }
  
  // Handle cases like 'zh-TW', 'zh-CN'
  const browserLangFull = navigator.language;
  if (languages[browserLangFull as Language]) {
    return browserLangFull as Language;
  }

  return DEFAULT_LANGUAGE;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const initialLanguage = getInitialLanguage();
      setLanguageState(initialLanguage);
    }
  }, [mounted]);

  const setLanguage = (lang: Language) => {
    if (languages[lang]) {
      setLanguageState(lang);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', lang);
      }
    }
  };

  const t = useCallback((key: string): string => {
    // On the server or before hydration, always use default language to prevent mismatch
    if (!mounted) {
      return translations[DEFAULT_LANGUAGE][key] || key;
    }
    return translations[language][key] || translations[DEFAULT_LANGUAGE][key] || key;
  }, [language, mounted]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
