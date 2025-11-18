
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Palette,
  Globe,
  Shield,
  Info,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';

const SettingsPage = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const settingsItems = [
    {
      href: '/settings/appearance',
      icon: Palette,
      label: t('appearance_title'),
    },
    {
      href: '/settings/language',
      icon: Globe,
      label: t('language_title'),
    },
    {
      href: '/privacy',
      icon: Shield,
      label: t('privacy_policy_title'),
    },
    {
      href: '/about',
      icon: Info,
      label: t('about_title'),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="mx-auto font-headline text-xl font-bold tracking-tight text-foreground">
          {t('settings_title')}
        </h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-2">
          {settingsItems.map((item) => (
            <Link href={item.href} key={item.href} passHref>
              <div
                className="flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-muted active:bg-slate-200"
              >
                <div className="flex items-center gap-4">
                  <item.icon className="h-6 w-6 text-muted-foreground" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;

    