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
    // console.log('Fetched chat_id:', params.chat_id); // Log chat_id to debug

    // Check if chat_id is valid (non-empty and non-null)
    if (!params.chat_id || params.chat_id.trim() === '') {
      // console.error('Invalid chat_id, skipping message fetch');
      setLoading(false);
      return;
    }

    setLoading(true); // Set loading state while fetching

    const currentOffset = isOlderFetch ? messages.length : 0;

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
          sender:profiles!messages_sender_id_fkey (
            id,
            username,
            email,
            avatar_url
          )
        `)
        .eq('chat_id', params.chat_id) // Ensure chat_id is valid
        .order('timestamp', { ascending: false })
        .range(currentOffset, currentOffset + limit - 1);

      if (error) {
        throw new Error('Error fetching chat messages: ' + error.message);
      }

      // Reverse the messages to maintain order from the oldest to the newest
      const newMessages = data.reverse().map((message: any) => ({
        ...message,
        sender: message.sender || { username: 'Unknown User', email: 'unknown@example.com' },
      }));

      // If we are fetching older messages, append them to the existing messages
      setMessages(prevMessages => {
        if (isOlderFetch) {
          return [...newMessages, ...prevMessages]; // Prepend to keep newest at the bottom
        }
        return newMessages; // Replace messages with the latest fetched messages
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setLoading(false);
    }
  };

  // Effect to fetch initial messages when `chat_id` changes
  useEffect(() => {
    // console.log('Chat ID updated:', params.chat_id); // Log chat_id updates

    // Only fetch messages if the chat_id is valid
    if (params?.chat_id?.trim()) {
      setMessages([]); // Reset messages when switching chats
      fetchChatMessages(); // Fetch messages for the chat when the component mounts
    } else {
      // console.log('Skipping fetch due to invalid chat_id');
    }
  }, [params?.chat_id]); // Depend on `chat_id` to fetch new messages when it changes

  return { messages, loading, fetchChatMessages };
}
