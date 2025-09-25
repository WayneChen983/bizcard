
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Contact } from '@/lib/types';
import { Camera, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ScanCardDialog } from './scan-card-dialog';
import type { ScanCardDetailsOutput } from '@/ai/flows/scan-card-details';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
  mobilePhone: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address.' }).optional().or(z.literal('')),
  website: z.string().url({ message: 'Invalid URL.' }).optional().or(z.literal('')),
  address: z.string().optional(),
  socialMedia: z.string().optional(),
  other: z.string().optional(),
});

type ContactFormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  contact?: Contact | null;
  onSave: (contact: Contact) => void;
  isSaving: boolean;
}

export function ContactForm({ contact, onSave, isSaving }: ContactFormProps) {
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: contact?.name || '',
      company: contact?.company || '',
      jobTitle: contact?.jobTitle || '',
      phone: contact?.phone || '',
      mobilePhone: contact?.mobilePhone || '',
      email: contact?.email || '',
      website: contact?.website || '',
      address: contact?.address || '',
      socialMedia: contact?.socialMedia || '',
      other: contact?.other || '',
    },
  });

  function onSubmit(values: ContactFormValues) {
    const newContact: Contact = {
      id: contact?.id || new Date().toISOString(),
      ...values,
      groups: contact?.groups || [],
    };
    onSave(newContact);
  }

  const handleScanComplete = (data: Partial<ScanCardDetailsOutput>) => {
    // Merge AI data with existing form data, prioritizing AI data for non-empty fields.
    const currentValues = form.getValues();
    const newValues = { ...currentValues };
    for (const key in data) {
        const typedKey = key as keyof ScanCardDetailsOutput;
        if (data[typedKey]) {
            (newValues as any)[typedKey] = data[typedKey];
        }
    }
    form.reset(newValues);
  };
  

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsScanDialogOpen(true)}
            >
              <Camera className="mr-2 h-4 w-4" />
              Scan with AI
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Marketing Director" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g. 123-456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="mobilePhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g. 098-765-4321" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="e.g. jane.doe@acme.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="e.g. https://acme.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g. 123 Main St, Anytown, USA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="socialMedia"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Social Media</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. @janedoe on X" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="other"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Other</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any other relevant information" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Contact
          </Button>
        </form>
      </Form>
      <ScanCardDialog
        open={isScanDialogOpen}
        onOpenChange={setIsScanDialogOpen}
        onScanComplete={handleScanComplete}
      />
    </>
  );
}
