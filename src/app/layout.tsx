
'use client';

import type { Metadata } from 'next';
import { Inter, PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/navbar';
import { usePathname } from 'next/navigation';
import { LanguageProvider } from '@/context/language-context';
import { useState } from 'react';
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
  const pathname = usePathname();
  const [contacts, setContacts] = useState<Contact[]>([]);

  const handleScanComplete = (newContact: Partial<Contact>) => {
    // This function will be passed down to the Navbar and triggered on scan completion
    // from the main page's camera button.
    const contactToSave: Contact = {
      id: new Date().toISOString(),
      name: newContact.name || 'New Contact',
      company: newContact.company || '',
      jobTitle: newContact.jobTitle || '',
      phone: newContact.phone || '',
      mobilePhone: newContact.mobilePhone || '',
      email: newContact.email || '',
      website: newContact.website || '',
      address: newContact.address || '',
      socialMedia: newContact.socialMedia || '',
      other: newContact.other || '',
      groups: [],
      images: newContact.images || [],
    };

     // Dispatch a custom event that the homepage will listen to
     window.dispatchEvent(new CustomEvent('newContactCreated', { detail: contactToSave }));
  };

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
              {showNavbar && <Navbar onScanComplete={handleScanComplete} />}
            </div>
          </div>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
