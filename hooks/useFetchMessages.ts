// hooks/useFetchMessages.ts
import { supabase } from "@/lib/supabase";
import { FetchMessagesParams } from "@/models/message";

export async function fetchMessages({ chatId, limit = 30, currentOffset }: FetchMessagesParams) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        timestamp,
        sender_id,
        is_forwarded,
        original_message_id,
        reply_to,
        reply_to_id,
        status,
        sender:profiles!messages_sender_id_fkey (
          id,
          username,
          email,
          avatar_url
        )
      `)
      .eq('chat_id', chatId)
      .order('timestamp', { ascending: false })
      .range(currentOffset, currentOffset + limit - 1);

    if (error) {
      throw new Error('Error fetching chat messages: ' + error.message);
    }

    const newMessages = data.map((message) => ({
      ...message,
      sender: message.sender || { username: 'Unknown User', email: 'unknown@example.com' },
    }));

    return newMessages;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    throw error;
  }
}
