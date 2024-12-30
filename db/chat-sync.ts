// /db/chat-sync.ts
import { fetchChatsFromSupabase, updateChatInSupabase } from '@/utils/supabase/chat'; // Supabase utility functions
import db from '@/db/dexie-db'; // Your Dexie instance
import { Chat } from '@/models/chat'; // Your Chat model

// Sync chats from Supabase to local Dexie database
export const syncChatsWithSupabase = async (userId: string): Promise<boolean> => {
  try {
    // Fetch the chats from Supabase
    const chatsFromSupabase = await fetchChatsFromSupabase(userId);

    // Store chats locally in Dexie DB
    await db.chats.bulkPut(chatsFromSupabase); // Use bulkPut to insert or update multiple chats at once

    return true;  // Indicate success
  } catch (error) {
    console.error('Error syncing chats from Supabase to local Dexie DB:', error);
    return false;  // Indicate failure
  }
};

// Sync updated chat from local Dexie DB to Supabase
export const syncUpdatedChatToSupabase = async (chat: Chat): Promise<boolean> => {
  try {
    // Update the chat in Supabase
    await updateChatInSupabase(chat);

    // Store the updated chat locally in Dexie DB
    await db.chats.put(chat);  // If the chat exists, it will be updated; if not, it'll be inserted

    return true;  // Indicate success
  } catch (error) {
    console.error('Error syncing updated chat to Supabase:', error);
    return false;  // Indicate failure
  }
};

// Sync multiple updated chats from Dexie DB to Supabase (optional)
export const syncUpdatedChatsToSupabase = async (chats: Chat[]): Promise<boolean> => {
  try {
    // Update the chats in Supabase
    await Promise.all(chats.map(chat => updateChatInSupabase(chat)));

    // Store the updated chats locally in Dexie DB
    await db.chats.bulkPut(chats);

    return true;  // Indicate success
  } catch (error) {
    console.error('Error syncing updated chats to Supabase:', error);
    return false;  // Indicate failure
  }
};
