'use client'
import { useEffect, useState } from 'react';
import useSession from '@/hooks/useSession';
import db from '@/db/dexie-db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSyncChatsWithSupabase } from './useSyncChatsWithSupabase';
import { Chat } from '@/models/chat';

export const useChats = () => {
  const { session, loading: sessionLoading } = useSession();
  const liveChats = useLiveQuery<Chat[]>(() => db.chats.toArray());
  const [contacts, setContacts] = useState<any[]>([]);
  const { syncing, syncChats, syncError } = useSyncChatsWithSupabase(session?.user?.id || '');
    const [dexieLoading, setDexieLoading] = useState<boolean>(true)

  useEffect(() => {
    if (sessionLoading) return;

    if (liveChats && liveChats.length === 0 && session?.user?.id) {
      syncChats();
    }
  }, [session, sessionLoading, syncChats, liveChats]);

  useEffect(() => {
    if (liveChats) {
        setDexieLoading(false)
      const mappedContacts = liveChats.map((chat) => ({
        id: chat.id,
        name: chat.name || 'Unnamed Chat',
        avatar: chat.avatar_url || '/default-avatar.png',
        lastMessage: chat.last_message || 'No messages yet',
        lastMessageTime: chat.timestamp ? new Date(chat.timestamp).getTime() : 0,
        unreadCount: chat.unread_count || 0,
        friend_id: chat.friend_id,
        is_group: chat.is_group,
      }));
      setContacts(mappedContacts);
    } else {
        setDexieLoading(true)
    }
  }, [liveChats]);

  return { contacts, loading: dexieLoading || syncing, syncError };
};