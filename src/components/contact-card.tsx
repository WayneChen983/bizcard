
'use client';

import type { Contact } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactCard({ contact, onEdit }: ContactCardProps) {
  return (
    <div
      className="flex cursor-pointer items-start gap-4 p-4 rounded-lg hover:bg-muted"
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
        <div className="mt-2 flex gap-1">
          {(contact.images || []).slice(0, 5).map((img, index) => (
             <div key={index} className="relative h-8 w-8">
                <Image
                src={img.url}
                alt={img.alt || 'contact image'}
                width={32}
                height={32}
                className="rounded-sm object-cover"
                />
            </div>
          ))}
           {(contact.images?.length || 0) > 5 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-gray-200">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
