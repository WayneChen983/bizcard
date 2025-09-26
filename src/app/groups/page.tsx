
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import type { Group } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
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
} from '@/components/ui/alert-dialog';

const GROUPS_STORAGE_KEY = 'bizcard-pro-groups';

const GroupsPage = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedGroups = localStorage.getItem(GROUPS_STORAGE_KEY);
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      }
    } catch (error) {
      console.error('Failed to load groups from localStorage', error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
      } catch (error) {
        console.error('Failed to save groups to localStorage', error);
      }
    }
  }, [groups, isInitialized]);

  const handleAddGroup = () => {
    if (newGroupName.trim() === '') return;
    const newGroup: Group = {
      id: new Date().toISOString(),
      name: newGroupName.trim(),
    };
    setGroups((prev) => [...prev, newGroup]);
    setNewGroupName('');
    toast({ title: t('group_added_toast_title') });
  };

  const handleDeleteGroup = (id: string) => {
    setGroups((prev) => prev.filter((group) => group.id !== id));
    toast({ title: t('group_deleted_toast_title') });
  };

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="mx-auto font-headline text-xl font-bold tracking-tight text-foreground">
          {t('groups_title')}
        </h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex gap-2">
          <Input
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder={t('add_group_placeholder')}
          />
          <Button onClick={handleAddGroup}>{t('add_group_button')}</Button>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          {groups.map((group) => (
            <div
              key={group.id}
              className="flex items-center justify-between rounded-lg bg-card p-4 border"
            >
              <span>{group.name}</span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t('delete_group_dialog_title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('delete_group_dialog_desc')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel_button')}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteGroup(group.id)}>
                      {t('delete_button')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GroupsPage;
