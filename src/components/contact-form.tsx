
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
import { Loader2, Trash2 } from 'lucide-react';
import type { ScanCardDetailsOutput } from '@/ai/flows/scan-card-details';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScanCardDialog } from './scan-card-dialog';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(1, { message: '姓名為必填欄位' }),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
  mobilePhone: z.string().optional(),
  email: z.string().email({ message: '無效的電子郵件地址' }).optional().or(z.literal('')),
  website: z.string().url({ message: '無效的網址' }).optional().or(z.literal('')),
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
      images: contact?.images || [],
    };
    onSave(newContact);
  }

  const handleScanComplete = (data: Partial<ScanCardDetailsOutput>) => {
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>姓名</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>公司</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>部門</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <h3 className="font-semibold">聯絡資訊</h3>
          <FormField
            control={form.control}
            name="mobilePhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>手機電話</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>電子郵件</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <h3 className="font-semibold">社群媒體</h3>
          <FormField
            control={form.control}
            name="socialMedia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LINE</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                   <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
         

          <h3 className="font-semibold">公司資訊</h3>
           <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>地址</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="other"
            render={({ field }) => (
              <FormItem>
                <FormLabel>備註</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-2 pt-4">
             {contact && (
                 <Button type="button" variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              儲存
            </Button>
          </div>
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
