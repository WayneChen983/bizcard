
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  Palette,
  Globe,
  Shield,
  Info,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import { Separator } from '@/components/ui/separator';

const ProfilePage = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const { user } = useUser();

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

  // This is a placeholder. In a real app, you would have a sign-out function.
  const handleSignOut = () => {
    console.log("Signing out...");
    // Here you would call your Firebase sign out function
    // For example: auth.signOut();
  };

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="mx-auto font-headline text-xl font-bold tracking-tight text-foreground">
          {t('nav_my_page')}
        </h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto bg-muted/40">
        <div className="p-4">
            <div className="flex items-center gap-4 rounded-lg bg-card p-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.photoURL || undefined} />
                    <AvatarFallback>{user?.isAnonymous ? "A" : (user?.displayName?.[0] || user?.email?.[0] || "U")}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{user?.isAnonymous ? "Anonymous User" : (user?.displayName || user?.email)}</p>
                    <p className="text-sm text-muted-foreground">{user?.isAnonymous ? `UID: ${user.uid.slice(0,6)}...` : user.uid}</p>
                </div>
            </div>
        </div>

        <div className="px-4">
            <div className="rounded-lg bg-card">
              {settingsItems.map((item, index) => (
                <Link href={item.href} key={item.href} passHref>
                  <div>
                    <div className="flex items-center justify-between p-4 transition-colors hover:bg-muted active:bg-slate-200">
                      <div className="flex items-center gap-4">
                        <item.icon className="h-6 w-6 text-muted-foreground" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    {index < settingsItems.length - 1 && <Separator className="ml-14" />}
                  </div>
                </Link>
              ))}
            </div>
        </div>
        
        {/* Placeholder for Ads */}
        <div className="p-4">
            <div className="rounded-lg bg-card p-4 text-center">
                <p className="text-muted-foreground">Ad Placeholder</p>
            </div>
        </div>


        {user && !user.isAnonymous && (
           <div className="p-4">
             <Button variant="outline" className="w-full bg-card" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4"/>
                Sign Out
             </Button>
           </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
