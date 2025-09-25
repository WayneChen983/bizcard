
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Contact } from '@/lib/types';
import { initialContacts } from '@/lib/contacts-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ContactForm } from '@/components/contact-form';
import { ContactList } from '@/components/contact-list';
import { AppLogo } from '@/components/icons';
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const LOCAL_STORAGE_KEY = 'bizcard-pro-contacts';

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedContacts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      } else {
        setContacts(initialContacts);
      }
    } catch (error) {
      console.error('Failed to load contacts from localStorage', error);
      setContacts(initialContacts);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
      } catch (error) {
        console.error('Failed to save contacts to localStorage', error);
      }
    }
  }, [contacts, isInitialized]);

  const handleAddNew = () => {
    setEditingContact(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    toast({
      title: 'Contact Deleted',
      description: 'The contact has been successfully removed.',
    });
  };

  const handleSave = (contact: Contact) => {
    setIsSaving(true);
    // Simulate async save
    setTimeout(() => {
      if (editingContact) {
        setContacts((prev) =>
          prev.map((c) => (c.id === contact.id ? contact : c))
        );
        toast({ title: 'Contact Updated' });
      } else {
        setContacts((prev) => [contact, ...prev]);
        toast({ title: 'Contact Added' });
      }
      setIsSaving(false);
      setIsSheetOpen(false);
    }, 500);
  };

  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    return contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  return (
    <div className="flex h-screen w-full justify-center bg-background">
      <div className="relative flex h-full w-full max-w-md flex-col border-x">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <AppLogo className="h-7 w-7 text-primary" />
            <h1 className="font-headline text-2xl font-bold tracking-tight text-foreground">
              BizCard Pro
            </h1>
          </div>
          <Button size="sm" onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            New
          </Button>
        </header>

        <main className="flex-1 overflow-hidden">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search contacts..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-140px)] px-4 pb-4">
             <ContactList
                contacts={filteredContacts}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
          </ScrollArea>
        </main>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent side="right" className="w-full max-w-md p-0">
             <ScrollArea className="h-full">
              <SheetHeader className="p-6">
                <SheetTitle className="font-headline text-2xl">
                  {editingContact ? 'Edit Contact' : 'New Contact'}
                </SheetTitle>
                <SheetDescription>
                  {editingContact
                    ? 'Update the details for this contact.'
                    : 'Add a new contact to your list. Try scanning a card!'}
                </SheetDescription>
              </SheetHeader>
              <div className="px-6 pb-6">
                 <ContactForm
                  contact={editingContact}
                  onSave={handleSave}
                  isSaving={isSaving}
                />
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
