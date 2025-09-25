
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Bell,
  Palette,
  Globe,
  Info,
  LogOut,
  ChevronRight,
  UserCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const SettingsPage = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Implement logout logic here
    console.log('User logged out');
    router.push('/'); 
  };
  
  const settingsOptions = [
    { icon: UserCircle, text: '個人檔案', action: () => {} },
    { icon: Bell, text: '通知', action: () => {} },
    { icon: Palette, text: '外觀', action: () => {} },
    { icon: Globe, text: '語言', action: () => {} },
    { icon: Info, text: '關於', action: () => {} },
  ];

  return (
    <div className="flex h-full flex-col">
       <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 p-4 backdrop-blur-sm">
        <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
          設定
        </h1>
      </header>
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://picsum.photos/seed/user/200" alt="User" />
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">陳慶瑋</h2>
              <p className="text-muted-foreground">r13942120@ntu.edu.tw</p>
            </div>
          </div>
        </div>

        <div className="px-4">
          <Separator />
        </div>

        <div className="p-2">
            {settingsOptions.map((option, index) => (
            <button
                key={index}
                onClick={option.action}
                className="flex w-full items-center gap-4 rounded-lg p-4 text-left transition-colors hover:bg-muted"
            >
                <option.icon className="h-6 w-6 text-muted-foreground" />
                <span className="flex-1 font-medium">{option.text}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
            ))}
        </div>

        <div className="p-6">
           <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            登出
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
