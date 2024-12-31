// /utils/supabase/message.ts
import { Message } from '@/models/message';  // Assuming Message model exists
import { supabase } from '@/lib/supabase';     // Supabase client

// Fetch messages from Supabase based on chat_id
export const fetchMessagesFromSupabase = async (chatId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    return data as Message[];  // Cast the returned data to Message type
  } catch (error) {
    console.error('Error fetching messages from Supabase:', error);
    throw error;  // Rethrow error to be handled in the calling function
  }
};

// Update a message in Supabase
export const updateMessageInSupabase = async (message: Message): Promise<void> => {
  try {
    const { error } = await supabase
      .from('messages')
      .upsert([message], { onConflict: 'id' });  // Ensure the message ID is used for the upsert

    if (error) throw error;

    console.log(`Message with ID ${message.id} successfully updated in Supabase.`);
  } catch (error) {
    console.error('Error updating message in Supabase:', error);
    throw error;  // Rethrow error to be handled in the calling function
  }
};
