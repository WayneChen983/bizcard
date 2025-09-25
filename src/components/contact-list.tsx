
'use client';

import type { Contact } from '@/lib/types';
import { ContactCard } from './contact-card';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
}

export function ContactList({ contacts, onEdit, onDelete }: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center">
        <h3 className="text-lg font-medium text-muted-foreground">找不到聯絡人。</h3>
        <p className="mt-1 text-sm text-muted-foreground">新增聯絡人以開始使用。</p>
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
