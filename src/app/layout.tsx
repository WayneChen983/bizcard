
'use client';

import React, { useEffect } from 'react';
import type { Metadata } from 'next';
import { Inter, PT_Sans } from 'next/font/google';
import './globals.css';
import 'react-image-crop/dist/ReactCrop.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { LanguageProvider } from '@/context/language-context';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-headline',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // set dark/light mode
  useEffect(() => {
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
          fontHeadline.variable
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
