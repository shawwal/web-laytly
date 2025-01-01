// /db/useChats.ts
import { useEffect, useState } from 'react';
import useSession from '@/hooks/useSession';  // Assuming a useSession hook
import { useChatsFromDexie } from './useChatsFromDexie';  // Import the Dexie hook
import { useSyncChatsWithSupabase } from './useSyncChatsWithSupabase';  // Import the sync hook

// Combined hook to fetch and sync chats
export const useChats = () => {
  const { session, loading: sessionLoading } = useSession();  // Fetch session data
  const { chats, loading: chatsLoading } = useChatsFromDexie();  // Fetch chats from Dexie
  const [contacts, setContacts] = useState<any[]>([]);  // Contact list state
  const { syncing, syncChats, syncError } = useSyncChatsWithSupabase(session?.user?.id || '');  // Syncing state

  useEffect(() => {
    if (sessionLoading) return;  // Wait for session data
  
    if (chats.length === 0 && session?.user?.id) {
      // If no chats in Dexie and user is logged in, sync from Supabase
      syncChats();
    }
  }, [session, sessionLoading, chats, syncChats]);  // Re-run on session change
  // console.log('chats', chats);
  useEffect(() => {
    if (!chatsLoading && !syncing) {
      const mappedContacts = chats.map((chat) => ({
        id: chat.id,
        name: chat.name || 'Unnamed Chat',
        avatar: chat.avatar_url || '/default-avatar.png',
        lastMessage: chat.last_message || 'No messages yet',
        lastMessageTime: chat.timestamp ? new Date(chat.timestamp).getTime() : 0,
        unreadCount: 0,  // Unread count logic can be added later
        friend_id: chat.friend_id,
        is_group: chat.is_group
      }));
      setContacts(mappedContacts);  // Set contacts for display
    }
  }, [chats, chatsLoading, syncing]);  // Update contacts when chats are fetched or syncing is done

  return { contacts, loading: chatsLoading || syncing, syncError };
};
