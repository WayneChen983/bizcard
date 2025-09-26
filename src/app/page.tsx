
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Contact, Group, SortOption } from '@/lib/types';
import { initialContacts, initialGroups } from '@/lib/contacts-data';
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
import { Search, Settings, Folder, ListFilter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { useLanguage } from '@/context/language-context';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { ScanCardDialog } from '@/components/scan-card-dialog';
import type { ScanCardDetailsOutput } from '@/ai/flows/scan-card-details';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSortOptions, sortContacts } from '@/lib/sorting';

const CONTACTS_STORAGE_KEY = 'bizcard-pro-contacts';
const GROUPS_STORAGE_KEY = 'bizcard-pro-groups';

export default function Home() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('time');

  useEffect(() => {
    try {
      const storedContacts = localStorage.getItem(CONTACTS_STORAGE_KEY);
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      } else {
        setContacts(initialContacts);
      }

      const storedGroups = localStorage.getItem(GROUPS_STORAGE_KEY);
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      } else {
        setGroups(initialGroups);
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
      setContacts(initialContacts);
      setGroups(initialGroups);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CONTACTS_STORAGE_KEY, JSON.stringify(contacts));
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
      } catch (error) {
        console.error('Failed to save data to localStorage', error);
      }
    }
  }, [contacts, groups, isInitialized]);

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
      title: t('contact_deleted_toast_title'),
      description: t('contact_deleted_toast_desc'),
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
          prev.map((c) => (c.id === contact.id ? { ...contact, createdAt: contact.createdAt || new Date().toISOString() } : c))
        );
        toast({ title: t('contact_updated_toast_title') });
      } else {
        const newContact = { ...contact, id: contact.id || new Date().toISOString(), createdAt: new Date().toISOString() };
        setContacts((prev) => [newContact, ...prev]);
        toast({ title: t('contact_added_toast_title') });
      }
      setIsSaving(false);
      setIsSheetOpen(false);
      setEditingContact(null);
    }, 500);
  };

  const handleScanAndSave = useCallback((scannedData: Partial<Contact>) => {
    const newContact: Contact = {
      id: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      name: scannedData.name || t('new_contact_default_name'),
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
      images: scannedData.images || [],
    };

    setContacts((prev) => [newContact, ...prev]);
  
    toast({
      title: t('contact_added_toast_title'),
      description: `${newContact.name} ${t('contact_autosaved_toast_desc')}`,
    });
  }, [t]);
  
  const filteredAndSortedContacts = useMemo(() => {
    let filtered = contacts;

    if (searchQuery) {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGroup) {
      filtered = filtered.filter((contact) =>
        contact.groups.includes(selectedGroup)
      );
    }

    return sortContacts(filtered, sortOption);
  }, [contacts, searchQuery, selectedGroup, sortOption]);
  
  const isEditing = !!editingContact?.id;

  const handleNavbarScanClick = () => {
    setIsScanDialogOpen(true);
  };

  const handleHomePageScanComplete = (scannedData: Partial<ScanCardDetailsOutput> & { cardImageUrl?: string }) => {
    const newContact: Partial<Contact> = {
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
    handleScanAndSave(newContact);
    setIsScanDialogOpen(false);
  };

  const availableSortOptions = getSortOptions(language);

  return (
    <>
      <div className="flex h-full flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-10"></div>
          <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
            {t('contact_list_title')}
          </h1>
          <Button variant="ghost" size="icon" onClick={() => router.push('/settings')}>
            <Settings className="h-6 w-6" />
          </Button>
        </header>

        <main className="flex-1 overflow-hidden">
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('search_placeholder')}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <ListFilter className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t('sort_by_label')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                    {availableSortOptions.map(option => (
                      <DropdownMenuRadioItem key={option} value={option}>{t(`sort_${option}`)}</DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {groups.length > 0 && (
               <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-2 pb-2">
                    <Button
                      variant={selectedGroup === null ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedGroup(null)}
                      className="rounded-full"
                    >
                      {t('all_groups_button')}
                    </Button>
                    {groups.map((group) => (
                      <Button
                        key={group.id}
                        variant={selectedGroup === group.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedGroup(group.id)}
                        className="rounded-full"
                      >
                        {group.name}
                      </Button>
                    ))}
                  </div>
               </ScrollArea>
            )}
          </div>
          <ScrollArea className="h-[calc(100vh-280px)] px-4 pb-4">
            <ContactList
              contacts={filteredAndSortedContacts}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAddNew={handleAddNew}
            />
          </ScrollArea>
        </main>

        <Sheet open={isSheetOpen} onOpenChange={(isOpen) => {
            if (!isOpen) {
              setEditingContact(null);
            }
            setIsSheetOpen(isOpen);
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
                  {isEditing ? t('edit_contact_title') : t('add_contact_title')}
                </SheetTitle>
                <SheetDescription>
                  {isEditing
                    ? t('edit_contact_desc')
                    : t('add_contact_desc')}
                </SheetDescription>
              </SheetHeader>
              <div className="px-6 pb-6">
                <ContactForm
                  contact={editingContact}
                  groups={groups}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  isSaving={isSaving}
                />
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        
        <Navbar onScanClick={handleNavbarScanClick} />
        <ScanCardDialog
          open={isScanDialogOpen}
          onOpenChange={setIsScanDialogOpen}
          onScanComplete={handleHomePageScanComplete}
        />
      </div>
    </>
  );
}
