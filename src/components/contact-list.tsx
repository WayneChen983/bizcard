
'use client';

import type { Contact } from '@/lib/types';
import { ContactCard } from './contact-card';
import { useLanguage } from '@/context/language-context';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function ContactList({ contacts, onEdit, onDelete }: ContactListProps) {
  const { t } = useLanguage();
  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
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
