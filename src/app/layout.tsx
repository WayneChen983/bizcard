
'use client';

import type { Metadata } from 'next';
import { Inter, PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/navbar';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { Contact } from '@/lib/types';
import { ScanCardDetailsOutput } from '@/ai/flows/scan-card-details';

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

  const handleScanComplete = (scannedData: Partial<ScanCardDetailsOutput> & { cardImageUrl?: string }) => {
    const newContact: Partial<Contact> = {
      id: new Date().toISOString(),
      name: scannedData.name || '',
      company: scannedData.company || '',
      jobTitle: scannedData.jobTitle || '',
      phone: scannedData.phone || '',
      mobilePhone: scannedData.mobilePhone || '',
      email: scannedData.email || '',
      website: scannedData.website || '',
      address: scannedData.address || '',
      socialMedia: scannedData.socialMedia || '',
      other: scannedData.other || '',
      groups: [],
      images: scannedData.cardImageUrl ? [{ url: scannedData.cardImageUrl, alt: 'Business card' }] : [],
    };
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('scanComplete', { detail: newContact }));
    }
  };


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>BizCard Pro</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={cn(
          'min-h-screen font-body antialiased',
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        <div className="relative flex h-screen w-full justify-center bg-background">
          <div className="relative flex h-full w-full max-w-md flex-col border-x">
            {children}
            {pathname !== '/scan' && <Navbar onScanComplete={handleScanComplete} />}
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
