
'use client';

import type { Contact } from '@/lib/types';
import { ContactCard } from './contact-card';
import { useLanguage } from '@/context/language-context';
import { Skeleton } from './ui/skeleton';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  isLoading: boolean;
}

export function ContactList({ contacts, onEdit, onDelete, isLoading }: ContactListProps) {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start gap-4 p-4 rounded-lg">
            <Skeleton className="h-12 w-12 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center mt-8">
        <h3 className="text-lg font-medium text-muted-foreground">{t('no_contacts_found_title')}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t('no_contacts_found_desc')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
