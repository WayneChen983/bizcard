
import { Timestamp } from 'firebase/firestore';

export type Contact = {
  id: string;
  createdAt: Timestamp | string; // Can be Timestamp from Firestore or string for new objects
  updatedAt?: Timestamp;
  name: string;
  company: string;
  jobTitle: string;
  phone: string;
  mobilePhone: string;
  email: string;
  website: string;
  address: string;
  socialMedia: string;
  other: string;
  groups: string[];
  images?: { url: string; alt?: string }[];
};

export type Group = {
  id: string;
  name: string;
  createdAt?: Timestamp;
};

export type SortOption = 'time' | 'alphabetical' | 'stroke' | 'zhuyin' | 'gojuon' | 'ganada' | 'cyrillic';
