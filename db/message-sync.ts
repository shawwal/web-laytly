// /db/message-sync.ts
import { fetchMessagesFromSupabase, updateMessageInSupabase } from '@/utils/supabase/message'; // Supabase utility functions for messages
import db from '@/db/dexie-db'; // Your Dexie instance
import { Message } from '@/models/message'; // Your Message model

// Sync messages from Supabase to local Dexie database based on chat_id
export const syncMessagesWithSupabase = async (chatId: string): Promise<boolean> => {
  try {
    // Fetch the messages from Supabase based on the chat_id
    const messagesFromSupabase = await fetchMessagesFromSupabase(chatId);

    // Store messages locally in Dexie DB (bulk insert or update)
    await db.messages.bulkPut(messagesFromSupabase);

    return true;  // Indicate success
  } catch (error) {
    console.error('Error syncing messages from Supabase to local Dexie DB:', error);
    return false;  // Indicate failure
  }
};

// Sync a single updated message from local Dexie DB to Supabase
export const syncUpdatedMessageToSupabase = async (message: Message): Promise<boolean> => {
  try {
    // Update the message in Supabase
    await updateMessageInSupabase(message);

    // Store the updated message locally in Dexie DB
    await db.messages.put(message);  // If the message exists, it will be updated; if not, it'll be inserted

    return true;  // Indicate success
  } catch (error) {
    console.error('Error syncing updated message to Supabase:', error);
    return false;  // Indicate failure
  }
};

// Sync multiple updated messages from local Dexie DB to Supabase
export const syncUpdatedMessagesToSupabase = async (messages: Message[]): Promise<boolean> => {
  try {
    // Update each message in Supabase
    await Promise.all(messages.map(message => updateMessageInSupabase(message)));

    // Store the updated messages locally in Dexie DB
    await db.messages.bulkPut(messages);

    return true;  // Indicate success
  } catch (error) {
    console.error('Error syncing updated messages to Supabase:', error);
    return false;  // Indicate failure
  }
};