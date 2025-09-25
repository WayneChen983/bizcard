
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
import { Menu, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ScanCardDetailsOutput } from '@/ai/flows/scan-card-details';

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
      title: '聯絡人已刪除',
      description: '聯絡人已成功移除',
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
        toast({ title: '聯絡人已更新' });
      } else {
        setContacts((prev) => [{ ...contact, images: [] }, ...prev]);
        toast({ title: '聯絡人已新增' });
      }
      setIsSaving(false);
      setIsSheetOpen(false);
    }, 500);
  };

  const handleScanAndCreate = (scannedData: Partial<ScanCardDetailsOutput>) => {
    const newContact: Contact = {
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
      images: [],
    };
    setEditingContact(newContact);
    setIsSheetOpen(true);
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
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 p-4 backdrop-blur-sm">
        <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
          名片列表
        </h1>
        <Button size="icon" variant="ghost">
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 overflow-hidden">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜尋聯絡人..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-210px)] px-4 pb-4">
          <ContactList
            contacts={filteredContacts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddNew={handleAddNew}
          />
        </ScrollArea>
      </main>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full max-w-md p-0">
          <ScrollArea className="h-full">
            <SheetHeader className="p-6">
              <SheetTitle className="font-headline text-2xl">
                {editingContact?.id && contacts.find(c => c.id === editingContact.id) ? '編輯聯絡人' : '新增聯絡人'}
              </SheetTitle>
              <SheetDescription>
                {editingContact?.id && contacts.find(c => c.id === editingContact.id)
                  ? '更新此聯絡人的詳細資訊。'
                  : '將新聯絡人新增至您的清單。試試掃描名片！'}
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
    </>
  );
}
