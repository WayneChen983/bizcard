'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { ScrollArea } from '@/components/ui/scroll-area';

const PrivacyPolicyPage = () => {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="mx-auto font-headline text-xl font-bold tracking-tight text-foreground">
          {t('privacy_policy_title')}
        </h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
            <div className="p-6 prose prose-sm dark:prose-invert max-w-full">
                <p>{t('privacy_policy_last_updated')}</p>
                
                <h2>{t('privacy_policy_section1_title')}</h2>
                <p>{t('privacy_policy_section1_content')}</p>

                <h2>{t('privacy_policy_section2_title')}</h2>
                <p>{t('privacy_policy_section2_content1')}</p>
                <ul>
                    <li>{t('privacy_policy_section2_list1')}</li>
                    <li>{t('privacy_policy_section2_list2')}</li>
                    <li>{t('privacy_policy_section2_list3')}</li>
                </ul>
                
                <h2>{t('privacy_policy_section3_title')}</h2>
                <p>{t('privacy_policy_section3_content')}</p>

                <h2>{t('privacy_policy_section4_title')}</h2>
                <p>{t('privacy_policy_section4_content')}</p>

                <h2>{t('privacy_policy_section5_title')}</h2>
                <p>{t('privacy_policy_section5_content')}</p>

                <h2>{t('privacy_policy_section6_title')}</h2>
                <p>{t('privacy_policy_section6_content')}</p>
            </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
