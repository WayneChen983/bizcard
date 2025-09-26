
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import type { Language, LanguageDefinition } from '@/lib/i18n';

const LanguagePage = () => {
  const router = useRouter();
  const { t, setLanguage, language, languages } = useLanguage();

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
    router.back();
  };

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="mx-auto font-headline text-xl font-bold tracking-tight text-foreground">
          {t('language_title')}
        </h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col">
          {Object.values(languages).map((lang: LanguageDefinition) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="flex items-center justify-between rounded-md p-4 text-left hover:bg-muted"
            >
              <span>{lang.name}</span>
              {language === lang.code && <Check className="h-5 w-5 text-primary" />}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LanguagePage;
