
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
  LogOut,
  User,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useFirebase, useUser } from '@/firebase';
import { signOut } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const SettingsPage = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const { auth } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: t('logout_button'),
        description: '已成功登出',
      });
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: 'destructive',
        title: '登出失敗',
        description: '無法登出，請稍後再試',
      });
    }
  };

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
      href: 'https://example.com/privacy',
      icon: Info,
      label: t('about_title'),
    },
  ];

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="mx-auto font-headline text-xl font-bold tracking-tight text-foreground">
          {t('settings_title')}
        </h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        {/* 用戶資訊卡片 */}
        {user && (
          <div className="mb-6 rounded-lg border bg-card p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || '用戶'} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">
                  {user.displayName || user.email || '訪客用戶'}
                </p>
                {user.email && (
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                )}
                {user.isAnonymous && (
                  <p className="text-sm text-muted-foreground">訪客模式</p>
                )}
              </div>
            </div>
          </div>
        )}

        <Separator className="mb-4" />

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

        <Separator className="my-4" />

        {/* 登出按鈕 */}
        <Button
          variant="outline"
          className="w-full gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          {t('logout_button')}
        </Button>
      </main>
    </div>
  );
};

export default SettingsPage;
