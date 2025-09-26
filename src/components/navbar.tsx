
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ScanCardDialog } from './scan-card-dialog';
import { useState } from 'react';
import type { ScanCardDetailsOutput } from '@/ai/flows/scan-card-details';
import { useLanguage } from '@/context/language-context';

export function Navbar({ onScanComplete }: { onScanComplete: (data: Partial<ScanCardDetailsOutput> & { cardImageUrl?: string }) => void }) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);

  const navItems = [
    { href: '/', label: t('nav_contacts'), icon: Icons.home },
    { href: '/scan', label: t('nav_scan'), icon: Icons.camera, isCentral: true },
    { href: '/settings/profile', label: t('nav_my_card'), icon: Icons.settings },
  ];

  const handleScan = (data: Partial<ScanCardDetailsOutput> & { cardImageUrl?: string }) => {
    onScanComplete(data);
    setIsScanDialogOpen(false);
  };
  
  const isSettingsPage = pathname.startsWith('/settings');

  return (
    <>
      <nav className="sticky bottom-0 z-10 border-t bg-background">
        <div className="mx-auto flex h-20 max-w-md items-center justify-around">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            if (item.isCentral) {
              return (
                <div key={item.href} className="relative">
                  <Button
                    variant="default"
                    size="icon"
                    className={cn(
                      "h-16 w-16 rounded-full shadow-lg transition-transform duration-300 ease-in-out",
                      (isSettingsPage && !pathname.startsWith('/settings/profile')) ? "translate-y-24" : "-translate-y-6"
                    )}
                    onClick={() => setIsScanDialogOpen(true)}
                    tabIndex={(isSettingsPage && !pathname.startsWith('/settings/profile')) ? -1 : 0}
                    aria-label={item.label}
                  >
                    <item.icon className="h-8 w-8" />
                  </Button>
                </div>
              );
            }
            return (
              <Link href={item.href} key={item.href} className="flex-1">
                <div
                  className={cn(
                    'flex flex-col items-center gap-1 p-2 text-muted-foreground transition-colors',
                    isActive && 'text-primary'
                  )}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
      <ScanCardDialog
        open={isScanDialogOpen}
        onOpenChange={setIsScanDialogOpen}
        onScanComplete={handleScan}
      />
    </>
  );
}
