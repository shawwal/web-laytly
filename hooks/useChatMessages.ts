import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Message } from '@/models/message'; // Assuming you have a Message model

interface ChatParams {
  chat_id: string;
}

export function useChatMessages(params: ChatParams) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const limit = 30;

  const fetchChatMessages = async (isOlderFetch = false) => {
    if (!params.chat_id || params.chat_id.trim() === '') {
      setLoading(false);
      return;
    }

    setLoading(true);

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
        .eq('chat_id', params.chat_id)
        .order('timestamp', { ascending: false })
        .range(currentOffset, currentOffset + limit - 1);

      if (error) {
        throw new Error('Error fetching chat messages: ' + error.message);
      }

      const newMessages = data.map((message: any) => ({
        ...message,
        sender: message.sender || { username: 'Unknown User', email: 'unknown@example.com' },
      }));

      // Prevent duplicates before adding the new messages
      setMessages(prevMessages => {
        const uniqueMessages = [
          ...newMessages.filter(msg => !prevMessages.some(existingMsg => existingMsg.id === msg.id)),
          ...prevMessages,
        ];
        return uniqueMessages;
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      setLoading(false);
    }
  };

  const addMessage = (message: Message) => {
    console.log('Adding message:', message);

    setMessages(prevMessages => {
      const isDuplicate = prevMessages.some(existingMsg => existingMsg.id === message.id);
      if (isDuplicate) {
        console.log('Duplicate message found, skipping addition');
        return prevMessages;
      }
      return [message, ...prevMessages]; // Add the new message
    });
  };

  const removeMessage = (messageId: string) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
  };

  useEffect(() => {
    if (params?.chat_id?.trim()) {
      setMessages([]);
      fetchChatMessages();
    }
  }, [params?.chat_id]);

  return { messages, loading, fetchChatMessages, addMessage, removeMessage };
}
