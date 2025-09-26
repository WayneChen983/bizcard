
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import type { Contact, Group } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const CONTACTS_STORAGE_KEY = 'bizcard-pro-contacts';
const GROUPS_STORAGE_KEY = 'bizcard-pro-groups';

const GroupDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { groupId } = params;
  const { t } = useLanguage();

  const [group, setGroup] = useState<Group | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);

  useEffect(() => {
    try {
      const storedGroups = localStorage.getItem(GROUPS_STORAGE_KEY);
      if (storedGroups) {
        const parsedGroups: Group[] = JSON.parse(storedGroups);
        const currentGroup = parsedGroups.find(g => g.id === groupId);
        setGroup(currentGroup || null);
      }
      
      const storedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
      if (storedContacts) {
        setAllContacts(JSON.parse(storedContacts));
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
    }
  }, [groupId]);

  const handleContactToggle = (contactId: string, inGroup: boolean) => {
    const updatedContacts = allContacts.map(c => {
      if (c.id === contactId) {
        const newGroups = inGroup
          ? c.groups.filter(gid => gid !== groupId)
          : [...c.groups, groupId as string];
        return { ...c, groups: newGroups };
      }
      return c;
    });

    setAllContacts(updatedContacts);
    try {
      localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(updatedContacts));
    } catch (error) {
      console.error('Failed to save contacts to localStorage', error);
    }
  };

  if (!group) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p>{t('loading_group') || 'Loading group...'}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="mx-auto font-headline text-xl font-bold tracking-tight text-foreground">
          {group.name}
        </h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
            <div className="p-4 flex flex-col gap-1">
            {allContacts.map(contact => {
                const isInGroup = contact.groups.includes(group.id);
                return (
                <div
                    key={contact.id}
                    className="flex items-center gap-4 rounded-lg p-3 hover:bg-muted"
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.images?.[0]?.url} alt={contact.name} />
                        <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.company}</p>
                    </div>
                    <Checkbox
                    checked={isInGroup}
                    onCheckedChange={() => handleContactToggle(contact.id, isInGroup)}
                    />
                </div>
                );
            })}
            </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default GroupDetailPage;
