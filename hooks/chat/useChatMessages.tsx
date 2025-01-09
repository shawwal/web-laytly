import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { isValidUUID } from '@/utils/userUtils';
import { addComment } from '@/utils/commentsUtils';
import { getFileNameFromString } from '@/utils/getFileNameFromString';
import { getPushTokensForOnlineUsers } from '@/utils/getPushTokensForOnlineUsers';

export default function useChatMessages(chatId: any, userId: any, listUserOnline: string[]) {
  const [sending, setSending] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 30; // Number of messages to fetch at a time

  // Reset offset when chat_id changes (i.e., when the chat screen is opened)
  useEffect(() => {
    setOffset(0);
  }, [chatId]);

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
        .eq('chat_id', chatId)
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
        // If it's the first load, set offset to limit
        setOffset(limit);
      } else if (mergedMessages.length > 0) {
        // If older messages were fetched, increment the offset
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
      // Validate cleanedReplyToId to ensure it's a valid UUID or null
      const validReplyToId = cleanedReplyToId && isValidUUID(cleanedReplyToId) ? cleanedReplyToId : null;
  
      const messageData = {
        chat_id: forwardId || chatId,
        sender_id: userId,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        is_forwarded: isForwarded,
        original_message_id: originalMessageId,
        reply_to_id: validReplyToId // Use the validated reply_to_id without the prefix
      };
  
      // Remove null or undefined properties
      const cleanedMessageData = Object.fromEntries(
        Object.entries(messageData).filter(([_, v]) => v != null)
      );
  
      const { data, error } = await supabase
        .from('messages')
        .insert(cleanedMessageData)
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
      // Check if it's a media message (e.g., contains video_ or image_)
      if (validReplyToId) {
        const itemId = getFileNameFromString(mediaPath);
        // Add a comment related to the media
        await addComment(
          chatId,   // chatId
          itemId,   // itemId (media)
          userId,   // userId
          `${newMessage}` // Comment text
        );
      }

      // After sending the message, send push notifications to online users (excluding the current user)
      const pushTokens = await getPushTokensForOnlineUsers(listUserOnline, userId);
      // console.log('pushTokens', pushTokens)
      for (const expoPushToken of pushTokens) {
  
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const notificationTitle = `New message from ${data.sender.username}`;
        const notificationBody = newMessage.trim();

        const response = await fetch('/api/sendPushNotification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            expoPushToken,
            title: notificationTitle,
            body: notificationBody,
            data: {},  // Optional additional data
          }),
        });
        // console.log('notificationTitle', notificationTitle)
        // console.log('response', response)

        if (!response.ok) {
          console.error('Error sending push notification');
        }
      }
  
      setSending(false);
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      setSending(false);
      return null;
    }
  };

  return { fetchChatMessages, fetchOlderMessages, handleSendMessage };
}
