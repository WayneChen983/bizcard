
'use client';

import type { Metadata } from 'next';
import { Inter, PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/navbar';
import { usePathname } from 'next/navigation';
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
  const pathname = usePathname();

  const pagesWithoutNavbar = ['/scan'];
  const showNavbar = !pagesWithoutNavbar.includes(pathname);


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
              {showNavbar && <Navbar />}
            </div>
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
