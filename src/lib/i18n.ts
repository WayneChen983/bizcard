
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import zhCN from './locales/zh-CN.json';
import zhTW from './locales/zh-TW.json';

export const translations = {
  en,
  es,
  fr,
  ja,
  ko,
  pt,
  ru,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
};

export type Language = keyof typeof translations;

export interface LanguageDefinition {
    code: Language;
    name: string;
}

export const languages: { [key in Language]: LanguageDefinition } = {
  'en': { code: 'en', name: 'English' },
  'zh-TW': { code: 'zh-TW', name: '繁體中文' },
  'zh-CN': { code: 'zh-CN', name: '简体中文' },
  'ja': { code: 'ja', name: '日本語' },
  'ko': { code: 'ko', name: '한국어' },
  'es': { code: 'es', name: 'Español' },
  'fr': { code: 'fr', name: 'Français' },
  'ru': { code: 'ru', name: 'Русский' },
  'pt': { code: 'pt', name: 'Português' },
};

export const DEFAULT_LANGUAGE: Language = 'en';
