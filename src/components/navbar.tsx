
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { ScanCardDialog } from './scan-card-dialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScanCardDetailsOutput } from '@/ai/flows/scan-card-details';

const navItems = [
  { href: '/', label: '名片列表', icon: Icons.home },
  { href: '/scan', label: '掃描', icon: Icons.camera, isCentral: true },
  { href: '/settings/profile', label: '我的名片', icon: Icons.profile },
];

export function Navbar({ onScanComplete }: { onScanComplete: (data: Partial<ScanCardDetailsOutput> & { cardImageUrl?: string }) => void }) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);

  const handleScan = (data: Partial<ScanCardDetailsOutput> & { cardImageUrl?: string }) => {
    onScanComplete(data);
    setIsScanDialogOpen(false);
  };
  
  const isProfilePage = pathname === '/settings/profile';

  return (
    <>
      <nav className="sticky bottom-0 z-10 border-t bg-background">
        <div className="mx-auto flex h-20 max-w-md items-center justify-around">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            if (item.isCentral) {
              return (
                <div key={item.href} className="relative">
                  <Button
                    variant="default"
                    size="icon"
                    className={cn(
                      "h-16 w-16 rounded-full shadow-lg transition-transform duration-300 ease-in-out",
                      isProfilePage ? "translate-y-24" : "-translate-y-6"
                    )}
                    onClick={() => setIsScanDialogOpen(true)}
                    tabIndex={isProfilePage ? -1 : 0}
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
