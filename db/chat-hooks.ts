// chat-hooks.ts

import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { Message } from '@/models/message'; // Assuming you have a Message model

export function useChatMessages(params: { chat_id: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const limit = 30; // Number of messages to fetch at a time

  const fetchChatMessages = async (isOlderFetch = false) => {
    try {
      setLoading(true);
      const currentOffset = isOlderFetch ? messages.length : 0;

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
          sender:profiles!messages_sender_id_fkey (
            id,
            username,
            email
          )
        `)
        .eq('chat_id', params.chat_id)
        .order('timestamp', { ascending: false })
        .range(currentOffset, currentOffset + limit - 1);

      if (error) {
        throw new Error('Error fetching chat messages: ' + error.message);
      }

      const newMessages = data.reverse().map((message: any) => ({
        ...message,
        sender: message.sender || { username: 'Unknown User', email: 'unknown@example.com' },
      }));

      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      setLoading(false);
      return newMessages;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setLoading(false);
      return [];
    }
  };

  return { messages, loading, fetchChatMessages };
}

// Implement useUpdateChatMessage to handle message updates
export function useUpdateChatMessage() {
  const updateMessage = async (updatedMessage: Message) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .upsert(updatedMessage) // Upsert to insert or update the message
        .select('*')
        .single();

      if (error) {
        throw new Error('Error updating message: ' + error.message);
      }

      return data;
    } catch (error) {
      console.error('Error updating message:', error);
      return null;
    }
  };

  return { updateMessage };
}
