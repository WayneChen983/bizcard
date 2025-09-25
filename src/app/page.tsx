
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ContactForm } from '@/components/contact-form';
import { ContactList } from '@/components/contact-list';
import { Menu, Search, Palette, Globe, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const LOCAL_STORAGE_KEY = 'bizcard-pro-contacts';

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<Contact>;
      handleScanAndCreate(customEvent.detail);
    };

    window.addEventListener('scanComplete', handler);

    return () => {
      window.removeEventListener('scanComplete', handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    setIsSheetOpen(false);
    setEditingContact(null);
  };

  const handleSave = (contact: Contact) => {
    setIsSaving(true);
    // Simulate async save
    setTimeout(() => {
      if (editingContact && contacts.some(c => c.id === contact.id)) {
        setContacts((prev) =>
          prev.map((c) => (c.id === contact.id ? contact : c))
        );
        toast({ title: '聯絡人已更新' });
      } else {
        // This handles both new contacts created via scanning and manually
        const newContact = { ...contact, id: contact.id || new Date().toISOString() };
        setContacts((prev) => [newContact, ...prev]);
        toast({ title: '聯絡人已新增' });
      }
      setIsSaving(false);
      setIsSheetOpen(false);
      setEditingContact(null);
    }, 500);
  };

  const handleScanAndCreate = (scannedContact: Contact) => {
    const newContact: Contact = {
      ...scannedContact,
      id: scannedContact.id || new Date().toISOString(),
    };
  
    // Auto-save the contact immediately
    setContacts((prev) => [newContact, ...prev]);
  
    // Open the sheet for optional editing
    setEditingContact(newContact);
    setIsSheetOpen(true);
  
    toast({
      title: '聯絡人已自動儲存',
      description: '您可以選擇性地編輯詳細資訊。',
    });
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
  
  const isEditing = !!editingContact;

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 p-4 backdrop-blur-sm">
        <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
          名片列表
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push('/settings/appearance')}>
              <Palette className="mr-2 h-4 w-4" />
              <span>外觀</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Globe className="mr-2 h-4 w-4" />
              <span>語言</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Info className="mr-2 h-4 w-4" />
              <span>關於</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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

      <Sheet open={isSheetOpen} onOpenChange={(isOpen) => {
          setIsSheetOpen(isOpen);
          if (!isOpen) {
            setEditingContact(null);
          }
        }}>
        <SheetContent side="right" className="w-full max-w-md p-0">
          <ScrollArea className="h-full">
            {editingContact?.images?.[0] && (
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={editingContact.images[0].url}
                  alt={editingContact.images[0].alt || "Business card"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <SheetHeader className="p-6">
              <SheetTitle className="font-headline text-2xl">
                {isEditing ? '編輯聯絡人' : '新增聯絡人'}
              </SheetTitle>
              <SheetDescription>
                {isEditing
                  ? '更新此聯絡人的詳細資訊。'
                  : '將新聯絡人新增至您的清單。試試掃描名片！'}
              </SheetDescription>
            </SheetHeader>
            <div className="px-6 pb-6">
              <ContactForm
                contact={editingContact}
                onSave={handleSave}
                onDelete={handleDelete}
                isSaving={isSaving}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
