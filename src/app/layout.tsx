
'use client';

import React from 'react';
import type { Metadata } from 'next';
import { Inter, PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { LanguageProvider } from '@/context/language-context';
import { ThemeProvider, useTheme } from '@/context/theme-context';
import { Loader2 } from 'lucide-react';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-headline',
});

function AppContent({ children }: { children: React.ReactNode }) {
  const { isThemeChanging } = useTheme();

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

        {isThemeChanging && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}
      </body>
    </html>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <AppContent>{children}</AppContent>
    </ThemeProvider>
  );
}
