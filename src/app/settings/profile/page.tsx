
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initialContacts } from '@/lib/contacts-data';
import {
  ChevronLeft,
  Mail,
  Phone,
  User,
  Building,
  Briefcase,
  Globe as GlobeIcon,
  MapPin,
  MessageSquare,
  Info,
  Pencil,
  Camera,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Contact } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { ContactForm } from '@/components/contact-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ScanCardDialog } from '@/components/scan-card-dialog';
import type { ScanCardDetailsOutput } from '@/ai/flows/scan-card-details';
import { useLanguage } from '@/context/language-context';

const LOCAL_STORAGE_KEY = 'bizcard-pro-contacts';

const ProfilePage = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [userContact, setUserContact] = useState<Contact | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);

  useEffect(() => {
    try {
      const storedContacts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedContacts) {
        const contacts: Contact[] = JSON.parse(storedContacts);
        // Assuming the first contact is the user's profile
        setUserContact(contacts[0] || null);
      } else {
        setUserContact(initialContacts[0] || null);
      }
    } catch (error) {
      console.error('Failed to load contacts from localStorage', error);
      setUserContact(initialContacts[0] || null);
    }
  }, []);

  const handleSave = (updatedContact: Contact) => {
    setIsSaving(true);
    setTimeout(() => {
      try {
        const storedContacts = localStorage.getItem(LOCAL_STORAGE_KEY);
        let contacts: Contact[] = storedContacts ? JSON.parse(storedContacts) : initialContacts;
        
        // Update the first contact (user's profile)
        contacts[0] = updatedContact;
        
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
        setUserContact(updatedContact);
        toast({ title: t('profile_updated_toast_title') });
      } catch (error) {
        console.error('Failed to save contacts to localStorage', error);
        toast({ variant: 'destructive', title: t('save_failed_toast_title') });
      } finally {
        setIsSaving(false);
        setIsSheetOpen(false);
      }
    }, 500);
  };

  const handleScanComplete = (data: Partial<ScanCardDetailsOutput> & { cardImageUrl?: string }) => {
    if (userContact) {
      // Create a fresh contact object, preserving only the ID and groups.
      const updatedContact: Contact = {
        id: userContact.id,
        name: data.name || '',
        company: data.company || '',
        jobTitle: data.jobTitle || '',
        phone: data.phone || '',
        mobilePhone: data.mobilePhone || '',
        email: data.email || '',
        website: data.website || '',
        address: data.address || '',
        socialMedia: data.socialMedia || '',
        other: data.other || '',
        groups: userContact.groups, // Preserve existing groups
        images: userContact.images || [], // Start with existing images
      };
      
      // Update image
      if (data.cardImageUrl) {
        updatedContact.images = [{ url: data.cardImageUrl, alt: "Business card" }, ...(userContact.images?.slice(1) || [])];
      }
      
      setUserContact(updatedContact);
      toast({ title: t('profile_updated_toast_title'), description: t('profile_updated_ai_toast_desc') });
    }
  };
  
  const infoItems = userContact ? [
    { icon: Briefcase, label: t('form_label_job_title'), value: userContact.jobTitle },
    { icon: Phone, label: t('form_label_mobile'), value: userContact.mobilePhone },
    { icon: Mail, label: t('form_label_email'), value: userContact.email },
    { icon: GlobeIcon, label: t('form_label_website'), value: userContact.website },
    { icon: Building, label: t('form_label_company'), value: userContact.company },
    { icon: MapPin, label: t('form_label_address'), value: userContact.address },
    { icon: MessageSquare, label: t('form_label_social'), value: userContact.socialMedia },
    { icon: Info, label: t('form_label_notes'), value: userContact.other },
  ] : [];

  return (
    <>
      <div className="flex h-full flex-col">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/80 p-2 backdrop-blur-sm">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="font-headline text-xl font-bold tracking-tight text-foreground">
            {t('my_card_title')}
          </h1>
          <Button variant="ghost" size="icon" onClick={() => setIsSheetOpen(true)}>
            <Pencil className="h-5 w-5" />
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          {userContact ? (
            <Card className="overflow-hidden">
              {userContact.images && userContact.images[0] && (
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={userContact.images[0].url}
                    alt={userContact.images[0].alt || 'Business card'}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="h-6 w-6" />
                  <span>{userContact.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {infoItems.map((item, index) =>
                  item.value ? (
                    <div key={index} className="flex items-start gap-4">
                      <item.icon
                        className="h-5 w-5 flex-shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="font-medium text-muted-foreground">
                          {item.label}
                        </p>
                        <p className="text-foreground">{item.value}</p>
                      </div>
                    </div>
                  ) : null
                )}
              </CardContent>
            </Card>
          ) : (
             <p className="p-4 text-center text-muted-foreground">{t('loading_profile_message')}</p>
          )}
        </main>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full max-w-md p-0">
          <ScrollArea className="h-full">
            {userContact?.images?.[0] && (
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={userContact.images[0].url}
                  alt={userContact.images[0].alt || "Business card"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <SheetHeader className="p-6">
              <div className="flex items-center justify-between">
                <SheetTitle className="font-headline text-2xl">
                  {t('edit_my_card_title')}
                </SheetTitle>
                <Button variant="outline" size="icon" onClick={() => setIsScanDialogOpen(true)}>
                  <Camera className="h-5 w-5" />
                </Button>
              </div>
              <SheetDescription>
                {t('edit_my_card_desc')}
              </SheetDescription>
            </SheetHeader>
            <div className="px-6 pb-6">
              <ContactForm
                contact={userContact}
                onSave={handleSave}
                isSaving={isSaving}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
       <ScanCardDialog
        open={isScanDialogOpen}
        onOpenChange={setIsScanDialogOpen}
        onScanComplete={handleScanComplete}
      />
    </>
  );
}

export default ProfilePage;
