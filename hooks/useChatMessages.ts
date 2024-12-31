import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from '@/models/message'; // Assuming you have a Message model

interface ChatParams {
  chat_id: string; // Ensure chat_id is a string
}

export function useChatMessages(params: ChatParams) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const limit = 30; // Number of messages to fetch at a time

  // Function to fetch chat messages from Supabase
  const fetchChatMessages = async (isOlderFetch = false) => {
    try {
      setLoading(true); // Set loading state while fetching

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
        .eq('chat_id', params.chat_id) // Ensure chat_id is valid
        .order('timestamp', { ascending: false })
        .range(currentOffset, currentOffset + limit - 1);

      if (error) {
        throw new Error('Error fetching chat messages: ' + error.message);
      }

      // Optionally reverse the order if you want them in ascending order
      const newMessages = data.reverse().map((message: any) => ({
        ...message,
        sender: message.sender || { username: 'Unknown User', email: 'unknown@example.com' },
      }));

      // Update state with the new messages
      setMessages(prevMessages => [...prevMessages, ...newMessages]);

      setLoading(false);
      return newMessages;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setLoading(false);
      return [];
    }
  };

  // Effect to fetch initial messages when `chat_id` changes
  useEffect(() => {
    if (params?.chat_id) {
      fetchChatMessages(); // Fetch messages for the chat when the component mounts
    }
  }, [params?.chat_id]);

  return { messages, loading, fetchChatMessages };
}
