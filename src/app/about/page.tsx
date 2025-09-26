
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AppLogo } from '@/components/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutPage = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const appVersion = '1.0.0'; // You can make this dynamic if needed
  const developerName = 'Your Name / Company Name';
  const contactEmail = 'your-email@example.com';

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="mx-auto font-headline text-xl font-bold tracking-tight text-foreground">
          {t('about_title')}
        </h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="flex flex-col items-center p-6 text-center">
            <AppLogo className="h-16 w-16 text-primary" />
            <h2 className="mt-4 font-headline text-2xl font-bold">BizCard Pro</h2>
            <p className="text-muted-foreground">
              {t('about_version')} {appVersion}
            </p>
          </div>
          <div className="p-6 pt-0">
            <Card>
              <CardHeader>
                <CardTitle>{t('about_developer_title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{developerName}</p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-primary hover:underline"
                >
                  {contactEmail}
                </a>
              </CardContent>
            </Card>

            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>© {new Date().getFullYear()} {developerName}. {t('about_rights_reserved')}</p>
            </div>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default AboutPage;
