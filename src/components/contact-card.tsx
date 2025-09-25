
'use client';

import type { Contact } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Building,
  Edit,
  Globe,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  Trash2,
  User,
  Users,
  Info,
  Briefcase,
} from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="text-muted-foreground mt-1">{icon}</div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{value}</p>
      </div>
    </div>
  );
};

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-md">
      <Accordion type="single" collapsible>
        <AccordionItem value={contact.id} className="border-b-0">
          <AccordionTrigger className="p-6 hover:no-underline">
            <div className="flex w-full items-center justify-between">
              <div className="text-left">
                <CardTitle className="font-headline text-xl">
                  {contact.name}
                </CardTitle>
                <CardDescription>
                  {contact.jobTitle && contact.company
                    ? `${contact.jobTitle} at ${contact.company}`
                    : contact.jobTitle || contact.company}
                </CardDescription>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-4">
              <DetailItem
                icon={<Mail size={16} />}
                label="Email"
                value={contact.email}
              />
              <DetailItem
                icon={<Phone size={16} />}
                label="Phone"
                value={contact.phone}
              />
              <DetailItem
                icon={<Smartphone size={16} />}
                label="Mobile"
                value={contact.mobilePhone}
              />
              <DetailItem
                icon={<Globe size={16} />}
                label="Website"
                value={contact.website}
              />
              <DetailItem
                icon={<MapPin size={16} />}
                label="Address"
                value={contact.address}
              />
              <DetailItem
                icon={<Users size={16} />}
                label="Social Media"
                value={contact.socialMedia}
              />
              <DetailItem
                icon={<Info size={16} />}
                label="Other"
                value={contact.other}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(contact)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(contact.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
