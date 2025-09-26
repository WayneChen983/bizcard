export type Contact = {
  id: string;
  createdAt: string; // ISO 8601 date string
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
};

export type SortOption = 'time' | 'alphabetical' | 'stroke' | 'zhuyin' | 'gojuon' | 'ganada' | 'cyrillic';
