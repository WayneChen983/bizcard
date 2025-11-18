
'use client';

import { pinyin } from 'pinyin-pro';
import type { Contact, SortOption } from './types';
import type { Language } from './i18n';
import { Timestamp } from 'firebase/firestore';

// A helper function to get stroke count for a single character
// For simplicity, we'll use a library or a pre-compiled map.
// Here we'll use pinyin-pro's stroke feature.
const getStrokes = (char: string): number => {
  const strokes = pinyin(char, { type: 'stroke' });
  // pinyin-pro returns a string of comma-separated numbers for polyphonic characters.
  // We'll take the first one.
  return parseInt(strokes.split(',')[0], 10) || 0;
};

// Function to compare names by stroke count
const compareByStrokes = (a: Contact, b: Contact): number => {
  const nameA = a.name;
  const nameB = b.name;
  const len = Math.min(nameA.length, nameB.length);

  for (let i = 0; i < len; i++) {
    const strokesA = getStrokes(nameA[i]);
    const strokesB = getStrokes(nameB[i]);
    if (strokesA !== strokesB) {
      return strokesA - strokesB;
    }
  }
  return nameA.length - nameB.length;
};

// Function to compare names by Zhuyin (Bopomofo)
const compareByZhuyin = (a: Contact, b: Contact): number => {
    return pinyin(a.name, { toneType: 'none' }).localeCompare(pinyin(b.name, { toneType: 'none' }), 'zh-TW');
};

const toDate = (timestamp: Timestamp | string): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
}

// Function to sort contacts
export const sortContacts = (contacts: Contact[], option: SortOption): Contact[] => {
  const sortedContacts = [...contacts]; // Create a shallow copy to avoid mutating the original array

  switch (option) {
    case 'time':
      return sortedContacts.sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime());
    
    case 'alphabetical':
      return sortedContacts.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
      
    case 'stroke':
      return sortedContacts.sort(compareByStrokes);
      
    case 'zhuyin':
      return sortedContacts.sort(compareByZhuyin);

    case 'gojuon':
      // localeCompare with 'ja' handles Gojuon sorting
      return sortedContacts.sort((a, b) => a.name.localeCompare(b.name, 'ja'));

    case 'ganada':
       // localeCompare with 'ko' handles Ganada sorting
      return sortedContacts.sort((a, b) => a.name.localeCompare(b.name, 'ko'));

    case 'cyrillic':
        // localeCompare with 'ru' handles Cyrillic sorting
      return sortedContacts.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    default:
      return contacts;
  }
};


export const getSortOptions = (language: Language): SortOption[] => {
    const baseOptions: SortOption[] = ['time', 'alphabetical'];

    switch (language) {
        case 'zh-TW':
            return [...baseOptions, 'stroke', 'zhuyin'];
        case 'zh-CN':
            return [...baseOptions, 'stroke'];
        case 'ja':
            return [...baseOptions, 'gojuon'];
        case 'ko':
            return [...baseOptions, 'ganada'];
        case 'ru':
            return [...baseOptions, 'cyrillic'];
        default:
            return baseOptions;
    }
}
