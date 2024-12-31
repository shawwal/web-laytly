import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import isValidUUID from '@/utils/userUtils';
import { addComment } from '@/utils/commentsUtils';
import { getFileNameFromString } from '@/utils/getFileNameFromString';

export default function useChatMessages(params?: any) {
  const [sending, setSending] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 30; // Number of messages to fetch at a time

  // Reset offset when chat_id changes (i.e., when the chat screen is opened)
  useEffect(() => {
    setOffset(0);
  }, [params?.chat_id]);

  const fetchChatMessages = async (isOlderFetch = false) => {
    try {
      const currentOffset = isOlderFetch ? offset : 0;

      // Fetch messages from Supabase
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

      const mergedMessages = data.reverse().map((message) => ({
        ...message,
        sender: message.sender || { username: 'Unknown User', email: 'unknown@example.com' },
      }));

      // Update offset
      if (!isOlderFetch) {
        setOffset(limit);
      } else if (mergedMessages.length > 0) {
        setOffset((prevOffset) => prevOffset + limit);
      }

      return mergedMessages;
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      return [];
    }
  };

  // Function to fetch older messages (triggered by "Load Older Messages" button)
  const fetchOlderMessages = async () => {
    return await fetchChatMessages(true); // Indicates this is an older fetch
  };

  const handleSendMessage = async (
    newMessage: string,
    isForwarded = false,
    originalMessageId: string | null = null,
    forwardId?: string,
    replyToId?: string,
    mediaPath?: string,
  ) => {
    if (newMessage.trim() === '' || sending) return;
    setSending(true);

    try {
      // Remove 'msg-' prefix if it exists in the replyToId
      const cleanedReplyToId = replyToId ? replyToId.replace(/^msg-/, '') : null;
      const validReplyToId = cleanedReplyToId && await isValidUUID(cleanedReplyToId) ? cleanedReplyToId : null;

      const messageData = {
        chat_id: forwardId || params.chat_id,
        sender_id: params.user_id,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        is_forwarded: isForwarded,
        original_message_id: originalMessageId,
        reply_to_id: validReplyToId // Use the validated reply_to_id without the prefix
      };

      // Optimistic update: Add the message immediately in the UI
      const optimisticMessage = {
        ...messageData,
        id: `msg-${Date.now()}`, // Temporary ID for optimistic UI
        status: 'sending' as const,
      };

      // Optimistically update the messages state
      // You can add this to your state update logic to display it immediately in the UI

      // Send the message to Supabase
      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select(`
          id,
          content,
          timestamp,
          sender_id,
          is_forwarded,
          original_message_id,
          reply_to_id,
          sender:profiles!messages_sender_id_fkey (
            id,
            username,
            email
          )
        `)
        .single();

      if (error) {
        throw new Error(`Error inserting message: ${error.message}`);
      }

      // If it's a media message, handle it
      if (validReplyToId) {
        const itemId = getFileNameFromString(mediaPath);
        await addComment(params.chat_id, itemId, params.user_id, newMessage);
      }

      // Update the state with the message data
      setSending(false);
      return data; // Return the data after it's successfully inserted
    } catch (error) {
      console.error('Error sending message:', error);
      setSending(false);
      return null;
    }
  };

  return { fetchChatMessages, fetchOlderMessages, handleSendMessage };
}
