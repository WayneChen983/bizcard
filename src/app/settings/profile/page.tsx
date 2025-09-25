
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initialContacts } from '@/lib/contacts-data';
import {
  ChevronLeft,
  Mail,
  Phone,
  User,
  Building,
  Briefcase,
  Globe as GlobeIcon,
  MapPin,
  MessageSquare,
  Info,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const router = useRouter();
  const userContact = initialContacts[0]; // Using the first contact as the user's profile

  const infoItems = [
    { icon: Briefcase, label: '部門', value: userContact.jobTitle },
    { icon: Phone, label: '手機', value: userContact.mobilePhone },
    { icon: Mail, label: 'Email', value: userContact.email },
    { icon: GlobeIcon, label: '網站', value: userContact.website },
    { icon: Building, label: '公司', value: userContact.company },
    { icon: MapPin, label: '地址', value: userContact.address },
    { icon: MessageSquare, label: 'LINE', value: userContact.socialMedia },
    { icon: Info, label: '備註', value: userContact.other },
  ];

  return (
    <div className="flex h-full flex-col">
      <header className="sticky top-0 z-10 flex items-center border-b bg-background/80 p-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="mx-auto font-headline text-xl font-bold tracking-tight text-foreground">
          個人檔案
        </h1>
        <div className="w-10"></div>
      </header>
      <main className="flex-1 overflow-y-auto p-4">
        <Card className="overflow-hidden">
          {userContact.images && userContact.images[0] && (
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={userContact.images[0].url}
                alt={userContact.images[0].alt || 'Business card'}
                fill
                className="object-cover"
              />
            </div>
          )}
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <User className="h-6 w-6" />
              <span>{userContact.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {infoItems.map((item, index) =>
              item.value ? (
                <div key={index} className="flex items-start gap-4">
                  <item.icon
                    className="h-5 w-5 flex-shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="text-foreground">{item.value}</p>
                  </div>
                </div>
              ) : null
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ProfilePage;
