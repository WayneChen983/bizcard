
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

const GROUPS_STORAGE_KEY = 'bizcard-pro-groups';

const GroupsPage = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    try {
      const storedGroups = localStorage.getItem(GROUPS_STORAGE_KEY);
      if (storedGroups) {
        setGroups(JSON.parse(storedGroups));
      }
    } catch (error) {
      console.error('Failed to load groups from localStorage', error);
    }
  }, []);

  const saveGroups = (updatedGroups: Group[]) => {
    try {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(updatedGroups));
    } catch (error) {
      console.error('Failed to save groups to localStorage', error);
    }
  };

  const handleAddGroup = () => {
    if (newGroupName.trim() === '') return;
    const newGroup: Group = {
      id: new Date().toISOString(),
      name: newGroupName.trim(),
    };
    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    saveGroups(updatedGroups);
    setNewGroupName('');
    setIsAddDialogOpen(false);
    toast({ title: t('group_added_toast_title') });
  };

  const handleDeleteGroup = (id: string) => {
    const updatedGroups = groups.filter((group) => group.id !== id);
    setGroups(updatedGroups);
    saveGroups(updatedGroups);
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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">{t('add_group_button')}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('add_group_button')}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder={t('add_group_placeholder')}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGroup()}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t('cancel_button')}</Button>
              </DialogClose>
              <Button onClick={handleAddGroup}>{t('add_group_button')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="mt-6 flex flex-col gap-2">
          {groups.map((group) => (
            <div
              key={group.id}
              className="flex items-center justify-between rounded-lg bg-card p-4 border"
            >
              <Link href={`/groups/${group.id}`} className="flex-1">
                <span className="hover:underline">{group.name}</span>
              </Link>
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
