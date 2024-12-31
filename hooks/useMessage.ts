// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState, useEffect } from 'react';
import { useChatMessages, useUpdateChatMessage } from '@/db/chat-hooks'; // Fetching messages from Supabase
import { syncMessagesWithSupabase, syncUpdatedMessagesToSupabase, syncUpdatedMessageToSupabase } from '@/db/message-sync'; // Sync to Supabase
import { isMessageChanged } from '@/utils/message-utils'; // Utility function to compare message objects
import useSession from '@/hooks/useSession'; // Assuming useSession hook returns session data
import { Message } from '@/models/message'; // Message model

export const useMessage = (chatId: string) => {
  const { session, loading: sessionLoading } = useSession(); // Session management hook

 // Early return if chatId is not available
 if (!chatId) {
  return { 
    currentMessages: [], 
    loading: true, 
    handleSendMessage: () => {}, 
    handleUpdateMessage: () => {}, 
    handleBulkUpdateMessages: () => {}, 
    sending: false 
  };
}

  const { messages, loading: messagesLoading, fetchChatMessages } = useChatMessages({ chat_id: chatId }); // Fetch messages from Supabase
  const { updateMessage } = useUpdateChatMessage(); // Function to update messages in Dexie
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]); // Local state for messages in this chat
  const [sending, setSending] = useState(false); // Track sending state

  // Fetch messages when session is loaded or messages change
  useEffect(() => {
    if (sessionLoading || messagesLoading) return;

    if (session?.user?.id) {
      // Sync from Supabase if no messages exist in local Dexie DB
      if (messages.length === 0) {
        syncMessagesWithSupabase(chatId).then(() => {
          const syncedMessages = messages.filter((message) => message.chat_id === chatId);
          setCurrentMessages(syncedMessages); // Update local state after syncing
        });
      } else {
        setCurrentMessages(messages);
      }
    }
  }, [session, messages, sessionLoading, messagesLoading, chatId]);

  // Handle sending a new message
  const handleSendMessage = async (newMessage: string) => {
    if (newMessage.trim() === '' || sending) return;
    setSending(true);

    try {
      // Optimistically add the message to local DB and UI first
      const optimisticMessage: Message = {
        id: `msg-${Date.now()}`, // Temporary ID for optimistic update
        chat_id: chatId,
        sender_id: session?.user?.id || '', // Ensure sender_id is defined
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        status: 'sending',
        // sender: { username: 'You', email: session?.user?.email || '' },
      };
      const updatedMessages = [...currentMessages, optimisticMessage];
      setCurrentMessages(updatedMessages);

      // Update Dexie with the optimistic message
      await updateMessage(optimisticMessage);

      // Now send the message to Supabase
      const { data, error } = await fetchChatMessages(); // Fetch chat messages (this is where we use the function)

      // If there's an error fetching chat messages or sending the message, handle it
      if (error) {
        throw new Error(`Error sending message: ${error.message}`);
      }

      // Sync the successfully sent message to Supabase
      if (data) {
        const finalMessages = currentMessages.map((msg) =>
          msg.id === optimisticMessage.id ? { ...optimisticMessage, status: 'sent' } : msg
        );
        setCurrentMessages(finalMessages);

        // Sync with Supabase after successful message send
        await syncUpdatedMessageToSupabase(data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSending(false);

      // Rollback UI state in case of failure (optional)
      setCurrentMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== optimisticMessage.id)
      );
    }
  };

  // Handle updating an existing message
  const handleUpdateMessage = async (updatedMessage: Message) => {
    const messageIndex = currentMessages.findIndex((message) => message.id === updatedMessage.id);

    if (messageIndex !== -1 && isMessageChanged(currentMessages[messageIndex], updatedMessage)) {
      try {
        // Update the message locally first (in Dexie)
        await updateMessage(updatedMessage);

        // Update local state with the updated message
        const updatedMessages = [...currentMessages];
        updatedMessages[messageIndex] = updatedMessage;
        setCurrentMessages(updatedMessages);

        // Sync the updated message with Supabase
        await syncUpdatedMessageToSupabase(updatedMessage);
      } catch (error) {
        console.error('Error updating message:', error);
      }
    }
  };

  // Bulk update messages
  const handleBulkUpdateMessages = async (updatedMessages: Message[]) => {
    try {
      // Update Dexie in bulk
      await syncUpdatedMessagesToSupabase(updatedMessages);

      // Update local state with the updated messages
      setCurrentMessages(updatedMessages);
    } catch (error) {
      console.error('Error bulk updating messages:', error);
    }
  };

  return {
    currentMessages,
    loading: sessionLoading || messagesLoading, // Loading state for messages
    handleSendMessage, // Function to handle sending a new message
    handleUpdateMessage, // Function to handle updating a single message
    handleBulkUpdateMessages, // Function to handle bulk updates for messages
    sending, // Flag to track if a message is being sent
  };
};
