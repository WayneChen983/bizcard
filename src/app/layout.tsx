
'use client';

import React, { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { Inter, PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/navbar';
import { usePathname } from 'next/navigation';
import { LanguageProvider } from '@/context/language-context';
import type { Contact } from '@/lib/types';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-headline',
});

// This can't be set in metadata object because we are using 'use client'
// export const metadata: Metadata = {
//   title: 'BizCard Pro',
//   description: 'A smart business card manager.',
//   icons: {
//     icon: '/favicon.svg',
//   },
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState('default');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem('colorTheme') || 'default';
    setTheme(storedTheme);
    
    // Initial theme setup
    const storedThemeMode = localStorage.getItem('theme') || 'system';
    if (
      storedThemeMode === 'dark' ||
      (storedThemeMode === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      document.body.classList.forEach(className => {
        if (className.startsWith('theme-')) {
          document.body.classList.remove(className);
        }
      });
      document.body.classList.add(`theme-${theme}`);
    }
  }, [theme, mounted]);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>BizCard Pro</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={cn(
          'min-h-screen font-body antialiased',
          fontBody.variable,
          fontHeadline.variable,
          `theme-${theme}`
        )}
      >
        <LanguageProvider>
          <div className="relative flex h-screen w-full justify-center bg-background">
            <div className="relative flex h-full w-full max-w-md flex-col border-x">
              {children}
            </div>
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
