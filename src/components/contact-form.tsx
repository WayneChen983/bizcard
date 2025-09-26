
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
import { Loader2, Trash2, ScanLine } from 'lucide-react';
import type { ScanCardDetailsOutput } from '@/ai/flows/scan-card-details';
import { ScanCardDialog } from './scan-card-dialog';
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLanguage } from '@/context/language-context';

export function ContactForm({ contact, onSave, onDelete, isSaving }: ContactFormProps) {
  const { t } = useLanguage();

  const formSchema = z.object({
    name: z.string().min(1, { message: t('validation_name_required') }),
    company: z.string().optional(),
    jobTitle: z.string().optional(),
    phone: z.string().optional(),
    mobilePhone: z.string().optional(),
    email: z.string().email({ message: t('validation_email_invalid') }).optional().or(z.literal('')),
    website: z.string().url({ message: t('validation_website_invalid') }).optional().or(z.literal('')),
    address: z.string().optional(),
    socialMedia: z.string().optional(),
    other: z.string().optional(),
  });
  
  type ContactFormValues = z.infer<typeof formSchema>;
  
  interface ContactFormProps {
    contact?: Contact | null;
    onSave: (contact: Contact) => void;
    onDelete?: (id: string) => void;
    isSaving: boolean;
  }

  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: contact || {
      name: '',
      company: '',
      jobTitle: '',
      phone: '',
      mobilePhone: '',
      email: '',
      website: '',
      address: '',
      socialMedia: '',
      other: '',
    },
  });

  useEffect(() => {
    form.reset(contact || {
      name: '',
      company: '',
      jobTitle: '',
      phone: '',
      mobilePhone: '',
      email: '',
      website: '',
      address: '',
      socialMedia: '',
      other: '',
    });
  }, [contact, form]);


  function onSubmit(values: ContactFormValues) {
    let images = contact?.images || [];

    // If a new image was scanned (passed via contact prop but not yet saved)
    // and it's not already in the images array, add it.
    if (contact?.images?.[0] && !images.some(img => img.url === contact.images?.[0].url)) {
      images = [...contact.images, ...images];
    }
    
    const newContact: Contact = {
      id: contact?.id || '',
      ...values,
      groups: contact?.groups || [],
      images: images,
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

  const handleDelete = () => {
    if (contact && onDelete) {
      onDelete(contact.id);
    }
  }

  const isEditing = !!contact?.id;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsScanDialogOpen(true)}
            >
              <ScanLine className="mr-2 h-5 w-5" />
              {t('scan_card_button')}
            </Button>
          )}
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_label_name')}</FormLabel>
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
                <FormLabel>{t('form_label_company')}</FormLabel>
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
                <FormLabel>{t('form_label_job_title')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <h3 className="font-semibold pt-2 border-t">{t('form_section_contact')}</h3>
          <FormField
            control={form.control}
            name="mobilePhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_label_mobile')}</FormLabel>
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
                <FormLabel>{t('form_label_email')}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
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
                <FormLabel>{t('form_label_website')}</FormLabel>
                <FormControl>
                   <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <h3 className="font-semibold pt-2 border-t">{t('form_section_other')}</h3>
          <FormField
            control={form.control}
            name="socialMedia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_label_social')}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form_label_address')}</FormLabel>
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
                <FormLabel>{t('form_label_notes')}</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-2 pt-4">
             {contact && onDelete && isEditing && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('delete_dialog_title')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('delete_dialog_desc')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('cancel_button')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>{t('delete_button')}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            )}
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('save_button')}
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
