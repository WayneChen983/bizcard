
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
import type { Contact, Group } from '@/lib/types';
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
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Timestamp } from 'firebase/firestore';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
  mobilePhone: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
  website: z.string().url({ message: 'Invalid URL' }).optional().or(z.literal('')),
  address: z.string().optional(),
  socialMedia: z.string().optional(),
  other: z.string().optional(),
  groups: z.array(z.string()).optional(),
});

type ContactFormValues = z.infer<typeof formSchema>;

interface ContactFormProps {
  contact?: Contact | null;
  groups: Group[];
  onSave: (contact: Contact) => void;
  onDelete?: (id: string) => void;
  isSaving: boolean;
}

export function ContactForm({ contact, groups, onSave, onDelete, isSaving }: ContactFormProps) {
  const { t } = useLanguage();
  const [isScanDialogOpen, setIsScanDialogOpen] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      groups: [],
    },
  });

  useEffect(() => {
    if (contact) {
      form.reset({
        name: contact.name || '',
        company: contact.company || '',
        jobTitle: contact.jobTitle || '',
        phone: contact.phone || '',
        mobilePhone: contact.mobilePhone || '',
        email: contact.email || '',
        website: contact.website || '',
        address: contact.address || '',
        socialMedia: contact.socialMedia || '',
        other: contact.other || '',
        groups: contact.groups || [],
      });
    } else {
      form.reset({
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
        groups: [],
      });
    }
  }, [contact, form]);


  function onSubmit(values: ContactFormValues) {
    const newContact: Contact = {
      id: contact?.id || '',
      createdAt: contact?.createdAt || new Date().toISOString(),
      ...values,
      groups: values.groups || [],
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
    setIsScanDialogOpen(false);
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

          <div className='space-y-2'>
            <Separator />
            <h3 className="font-semibold text-sm text-muted-foreground pt-2">{t('form_section_contact')}</h3>
          </div>
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

          <div className='space-y-2'>
            <Separator />
            <h3 className="font-semibold text-sm text-muted-foreground pt-2">{t('form_section_other')}</h3>
          </div>
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

          {groups && groups.length > 0 && (
            <div className="space-y-2">
              <Separator />
              <h3 className="font-semibold text-sm text-muted-foreground pt-2">{t('form_section_groups')}</h3>
              <FormField
                control={form.control}
                name="groups"
                render={() => (
                  <FormItem className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      {groups.map((group) => (
                        <FormField
                          key={group.id}
                          control={form.control}
                          name="groups"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={group.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(group.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), group.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== group.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {group.name}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}


          <div className="flex justify-between gap-4 pt-4">
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
