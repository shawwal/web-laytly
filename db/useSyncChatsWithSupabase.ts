// /db/useSyncChatsWithSupabase.ts
import { useState } from 'react';
import { syncChatsWithSupabase } from '@/db/chat-sync';

// Hook to sync chats with Supabase
export const useSyncChatsWithSupabase = (userId: string) => {
  const [syncing, setSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const syncChats = async () => {
    if (!userId) return;

    setSyncing(true);
    setSyncError(null);  // Reset any previous errors

    try {
      await syncChatsWithSupabase(userId);  // Sync chats from Supabase
    } catch (error) {
      console.error('Error syncing chats with Supabase:', error);
      setSyncError('Failed to sync chats');
    } finally {
      setSyncing(false);
    }
  };

  return { syncing, syncChats, syncError };
};
