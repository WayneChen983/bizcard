
'use client';

import React, { useEffect } from 'react';
import { Inter, PT_Sans } from 'next/font/google';
import './globals.css';
import 'react-image-crop/dist/ReactCrop.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { LanguageProvider } from '@/context/language-context';
import { FirebaseClientProvider } from '@/firebase/client-provider';

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
    const applyTheme = (theme: string) => {
      const isDarkMode =
        theme === 'dark' ||
        (theme === 'system' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      document.documentElement.classList.toggle('dark', isDarkMode);

      // Update theme-color meta tag for PWA
      const themeColor = isDarkMode ? 'hsl(210 10% 10%)' : 'hsl(208 100% 97.1%)';
      let themeColorMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeColorMeta) {
        themeColorMeta = document.createElement('meta');
        themeColorMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeColorMeta);
      }
      themeColorMeta.setAttribute('content', themeColor);
    };

    const storedThemeMode = localStorage.getItem('theme') || 'system';
    applyTheme(storedThemeMode);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const currentTheme = localStorage.getItem('theme') || 'system';
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>BizCard Pro</title>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={cn(
          'min-h-screen font-body antialiased',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        <FirebaseClientProvider>
          <LanguageProvider>
            <div className="relative flex h-screen w-full justify-center bg-background">
              <div className="relative flex h-full w-full max-w-md flex-col border-x">
                {children}
              </div>
            </div>
            <Toaster />
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
