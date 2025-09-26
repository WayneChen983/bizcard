import type { Contact, Group } from '@/lib/types';

export const initialGroups: Group[] = [
  { id: '1', name: 'Clients' },
  { id: '2', name: 'Networking' },
  { id: '3', name: 'Vendors' },
];


export const initialContacts: Contact[] = [
  {
    id: '1',
    createdAt: '2023-10-26T10:00:00Z',
    name: '陳慶瑋',
    company: '國立台灣大學電機資訊學院',
    jobTitle: '電信工程學研究所通訊組',
    phone: '',
    mobilePhone: '+886 0901309639',
    email: 'r13942120@ntu.edu.tw',
    website: 'linkedin.com/in/wayne-chen-eecs',
    address: '台北市大安區羅斯福路四段1號',
    socialMedia: 'goup4you',
    other: '博理館515',
    groups: ['2'],
    images: [
      { url: "https://picsum.photos/seed/card-front/800/500", alt: "Business card front" },
      { url: "https://picsum.photos/seed/map/200/200", alt: "Map" },
      { url: "https://picsum.photos/seed/notes/200/200", alt: "Notes" },
      { url: "https://picsum.photos/seed/event/200/200", alt: "Event" },
      { url: "https://picsum.photos/seed/receipt/200/200", alt: "Receipt" },
      { url: "https://picsum.photos/seed/whiteboard/200/200", alt: "Whiteboard" },
    ]
  },
];