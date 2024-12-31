// src/atoms/chatAtoms.ts
import { Message } from '@/models/message';
import { atom } from 'recoil';

export const activeContactIdState = atom<string | null>({
  key: 'activeContactId', // unique ID for this atom
  default: null, // Default state for activeContactId
});

export const messagesState = atom<Message[]>({
  key: 'messages', // unique ID for this atom
  default: [], // Default state for messages
});

export const isMobileMessageViewState = atom<boolean>({
  key: 'isMobileMessageView', // unique ID for this atom
  default: false, // Default state for mobile message view
});
