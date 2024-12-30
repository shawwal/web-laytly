// /db/useChatsFromDexie.ts
import { useState, useEffect } from 'react';
import db from '@/db/dexie-db';  // Assuming Dexie setup
import { Chat } from '@/models/chat';  // Assuming the Chat model is defined

// Hook to fetch chats from the local Dexie database
export const useChatsFromDexie = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatsFromDb = await db.chats.toArray();
        setChats(chatsFromDb);  // Set chats from Dexie DB
        setLoading(false);  // Done loading
      } catch (error) {
        console.error('Error fetching chats from Dexie:', error);
        setLoading(false);  // Done loading even in case of error
      }
    };

    fetchChats();
  }, []);  // Run only on component mount

  return { chats, loading };
};
