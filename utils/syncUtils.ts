import db from '@/db/dexie-db';
import { fetchMessagesFromSupabase as fetchMessagesFromSupabaseAPI, insertMessageToSupabase as insertMessageToSupabaseAPI } from '@/utils/supabase/chat'; 

// Sync all messages from DexieDB to Supabase
export const syncMessagesWithSupabase = async () => {
  const offlineMessages = await db.messages.toArray();

  for (let message of offlineMessages) {
    await insertMessageToSupabaseAPI(message); // Insert message to Supabase
    await db.messages.delete(message.id); // Remove from DexieDB after syncing
  }
};

// Sync a single message to Supabase
export const insertMessageToSupabaseLocally = async (message: any) => {
  try {
    // Insert message locally to DexieDB
    await db.messages.put(message);
  } catch (error) {
    console.error('Error inserting message locally:', error);
  }
};

// Sync a single message to Supabase (renamed to avoid conflict)
export const insertMessageToSupabase = async (message: any) => {
  try {
    await insertMessageToSupabaseAPI(message); // Sync message to Supabase
    // Optionally, insert the message locally if needed
    await insertMessageToSupabaseLocally(message); // Insert locally (optional)
  } catch (error) {
    console.error('Error syncing message with Supabase:', error);
  }
};

// Example usage: Fetch messages from Supabase (if needed)
export const fetchMessagesFromSupabase = async (chatId: string) => {
  try {
    const messages = await fetchMessagesFromSupabaseAPI(chatId); // Fetch messages from Supabase
    return messages;
  } catch (error) {
    console.error('Error fetching messages from Supabase:', error);
  }
};
