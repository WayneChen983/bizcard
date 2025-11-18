
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

export function Navbar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/', label: t('nav_contacts'), icon: Icons.home },
    { href: '/ai-assistant', label: t('nav_ai_assistant'), icon: Icons.aiAssistant },
    { href: '/business-info', label: t('nav_business_info'), icon: Icons.businessInfo },
    { href: '/profile', label: t('nav_my_page'), icon: Icons.profile },
  ];

  return (
    <>
      <nav className="sticky bottom-0 z-10 border-t bg-background">
        <div className="mx-auto flex h-20 max-w-md items-center justify-around">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

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
    </>
  );
}
