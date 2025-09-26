
'use client';

import type { Contact } from '@/lib/types';
import Image from 'next/image';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactCard({ contact, onEdit }: ContactCardProps) {
  return (
    <div
      className="flex cursor-pointer items-start gap-4 p-4 rounded-lg hover:bg-muted active:scale-[0.98] transition-all duration-150"
      onClick={() => onEdit(contact)}
    >
      <div className="relative h-12 w-12 flex-shrink-0">
        <Image
          src={contact.images?.[0]?.url || "https://picsum.photos/seed/1/100/100"}
          alt={contact.name}
          width={48}
          height={48}
          className="rounded-md object-cover"
        />
      </div>
      <div className="flex-1">
        <p className="font-semibold">{contact.name}</p>
        <p className="text-sm text-muted-foreground">{contact.company}</p>
      </div>
    </div>
  );
}
