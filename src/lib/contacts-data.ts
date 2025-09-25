
import type { Contact } from '@/lib/types';

export const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'Alex Doe',
    company: 'Innovate Inc.',
    jobTitle: 'Lead Developer',
    phone: '123-456-7890',
    mobilePhone: '098-765-4321',
    email: 'alex.doe@innovate.com',
    website: 'innovate.com',
    address: '123 Innovation Drive, Tech City',
    socialMedia: '@alexdoedev',
    other: 'Expert in React and Node.js.',
    groups: ['networking', 'clients'],
  },
  {
    id: '2',
    name: 'Jane Smith',
    company: 'Design Solutions',
    jobTitle: 'UX/UI Designer',
    phone: '234-567-8901',
    mobilePhone: '876-543-2109',
    email: 'jane.smith@design.io',
    website: 'design.io',
    address: '456 Creative Lane, Design District',
    socialMedia: '@janesmithdesign',
    other: 'Loves minimalist design.',
    groups: ['vendors'],
  },
];
