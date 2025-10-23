
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import type { Contact, Group } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useFirebase, useCollection, useDoc, useMemoFirebase, useUser } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';

const GroupDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { groupId } = params;
  const { t } = useLanguage();

  const { firestore } = useFirebase();
  const { user } = useUser();

  const groupDocRef = useMemoFirebase(() => {
    if (!user || !groupId) return null;
    return doc(firestore, 'users', user.uid, 'groups', groupId as string);
  }, [firestore, user, groupId]);
  const { data: group, isLoading: groupLoading } = useDoc<Group>(groupDocRef);
  
  const contactsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'contacts');
  }, [firestore, user]);
  const { data: allContacts = [], isLoading: contactsLoading } = useCollection<Contact>(contactsQuery);

  const handleContactToggle = (contactId: string, inGroup: boolean) => {
    if (!user || !groupId) return;

    const contactRef = doc(firestore, 'users', user.uid, 'contacts', contactId);
    const currentContact = allContacts.find(c => c.id === contactId);
    if (!currentContact) return;

    // Ensure 'groups' property exists and is an array
    const currentGroups = Array.isArray(currentContact.groups) ? currentContact.groups : [];

    const newGroups = inGroup
      ? currentGroups.filter(gid => gid !== groupId)
      : [...currentGroups, groupId as string];
    
    updateDocumentNonBlocking(contactRef, { groups: newGroups });
  };

  if (groupLoading || contactsLoading) {
    return (
      <div className="flex h-full flex-col">
        <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-2 backdrop-blur-sm">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Skeleton className="h-6 w-32 mx-auto" />
          <div className="w-10"></div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-5 w-5 rounded-sm" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p>{t('loading_group') || 'Group not found.'}</p>
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
                const isInGroup = Array.isArray(contact.groups) && contact.groups.includes(group.id);
                return (
                <div
                    key={contact.id}
                    className="flex items-center gap-4 rounded-lg p-3 hover:bg-muted"
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.images?.[0]?.url} alt={contact.name} />
                        <AvatarFallback>{contact.name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.company}</p>
                    </div>
                    <Checkbox
                    checked={isInGroup}
                    onCheckedChange={() => handleContactToggle(contact.id, !!isInGroup)}
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

    
