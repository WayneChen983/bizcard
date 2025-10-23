'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFirebase, useUser } from '@/firebase';
import { signInWithGoogle, initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { useLanguage } from '@/context/language-context';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { auth } = useFirebase();
  const { user, isUserLoading } = useUser();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // 如果已登入，重定向到首頁
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle(auth);
      toast({
        title: t('login_success_title') || '登入成功',
        description: t('login_success_desc') || '歡迎使用 BizCard Pro',
      });
      router.push('/');
    } catch (error) {
      console.error('Google sign-in failed:', error);
      toast({
        variant: 'destructive',
        title: t('login_failed_title') || '登入失敗',
        description: t('login_failed_desc') || '無法使用 Google 登入，請稍後再試',
      });
      setIsSigningIn(false);
    }
  };

  const handleAnonymousSignIn = () => {
    setIsSigningIn(true);
    try {
      initiateAnonymousSignIn(auth);
      toast({
        title: t('login_success_title') || '登入成功',
        description: t('guest_login_desc') || '以訪客身份登入',
      });
      // 登入成功後會自動重定向（透過 useEffect）
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
      toast({
        variant: 'destructive',
        title: t('login_failed_title') || '登入失敗',
        description: t('login_failed_desc') || '無法登入，請稍後再試',
      });
      setIsSigningIn(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="mb-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="relative h-20 w-20">
            <Image
              src="/icon.svg"
              alt="BizCard Pro Logo"
              width={80}
              height={80}
              className="rounded-2xl"
            />
          </div>
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-gray-900">
          BizCard Pro
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {t('login_subtitle') || 'AI 驅動的智慧名片管理'}
        </p>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="font-headline text-2xl">
            {t('login_title') || '登入'}
          </CardTitle>
          <CardDescription>
            {t('login_description') || '選擇登入方式以開始使用'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full gap-2 bg-white text-gray-900 hover:bg-gray-50 border border-gray-300"
            size="lg"
          >
            {isSigningIn ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  style={{ fill: '#4285F4' }}
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  style={{ fill: '#34A853' }}
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  style={{ fill: '#FBBC05' }}
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  style={{ fill: '#EA4335' }}
                />
              </svg>
            )}
            {t('login_with_google') || '使用 Google 登入'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('or') || '或'}
              </span>
            </div>
          </div>

          <Button
            onClick={handleAnonymousSignIn}
            disabled={isSigningIn}
            variant="outline"
            className="w-full"
            size="lg"
          >
            {isSigningIn ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : null}
            {t('continue_as_guest') || '以訪客身份繼續'}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            {t('login_disclaimer') || '繼續即表示您同意我們的服務條款和隱私政策'}
          </p>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>✨ AI 名片掃描 | 🌐 多語言支援 | ☁️ 雲端同步</p>
      </div>
    </div>
  );
}

