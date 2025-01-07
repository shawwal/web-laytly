/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from "react";
import { useMessageState } from "@/hooks/useMessageState";
import { usePagination } from "@/hooks/usePagination";
import { fetchMessages } from "@/hooks/useFetchMessages";
import useSenderDetails from '@/hooks/useSenderDetails';
import { supabase } from "@/lib/supabase";

interface ChatParams {
  chat_id: string;
}

export function useChatMessages({ chat_id }: ChatParams) {
  const { messages, addMessage, editMessage, removeMessage, setMessageList } = useMessageState();
  const { currentOffset, limit, fetchOlderMessages, resetPagination } = usePagination();
  const [loading, setLoading] = useState(true);
  const [isFetchingOlder, setIsFetchingOlder] = useState(false);
  const { fetchSenderDetails } = useSenderDetails();
  // Fetch chat messages from Supabase
  const fetchChatMessages = async (isOlderFetch = false) => {
    if (!chat_id || chat_id.trim() === '') {
      console.log('No chat_id provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    if (isOlderFetch) {
      setIsFetchingOlder(true);
    }

    // console.log(`Fetching messages for chat_id: ${chat_id} (offset: ${currentOffset}, limit: ${limit})`);

    try {
      const newMessages = await fetchMessages({ chatId: chat_id, limit, currentOffset });
      // console.log(`Fetched ${newMessages.length} new messages for chat_id: ${chat_id}`);

      // @ts-ignore
      setMessageList((prevMessages) => {
        const uniqueMessages = [
          ...newMessages.filter(msg => !prevMessages.some((existingMsg: any) => existingMsg.id === msg.id)),
          ...prevMessages,
        ];
        // console.log(`Updated message list with ${uniqueMessages.length} messages.`);
        return uniqueMessages;
      });

      if (isOlderFetch) {
        fetchOlderMessages();
      }
    } catch (error) {
      console.error('Error fetching chat messages:', error);
    } finally {
      setLoading(false);
      setIsFetchingOlder(false);
    }
  };

  // Real-time subscription to handle changes in the 'messages' table
  useEffect(() => {
    if (!chat_id.trim()) return;

    console.log(`Subscribing to real-time updates for chat_id: ${chat_id}`);

    const handleNewMessage = async (payload: any) => {
      const senderData = await fetchSenderDetails(payload.new.sender_id);
      const newMessage = { ...payload.new, sender: senderData };

      // console.log('New message received:', newMessage);
      addMessage(newMessage); // Add the new message to state
    };
    const handleUpdateMessage = async (payload: any) => {
      console.log('triggered edit:', payload);
      const updatedMessage = payload.new;
      console.log('Re-adding updated message:', updatedMessage);

      editMessage(updatedMessage); // Update or replace the message
    };
    const handleDeleteMessage = async (payload: any) => {
      console.log('triggered delete:', payload);
      const deletedMessageId = payload.old.id;
      console.log('Removing message with ID:', deletedMessageId);
      removeMessage(deletedMessageId); // Remove the deleted message by ID
    };


    // Create a Supabase real-time channel for the chat's messages
    const channel = supabase
      .channel(`public:messages:chat_id=eq.${chat_id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chat_id}` }, handleNewMessage)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', filter: `chat_id=eq.${chat_id}` }, handleUpdateMessage)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages', filter: `chat_id=eq.${chat_id}` }, handleDeleteMessage)
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      console.log(`Unsubscribing from real-time updates for chat_id: ${chat_id}`);
      channel.unsubscribe();
    };
  }, [chat_id]);

  // Fetch messages on initial load or when `chat_id` changes
  useEffect(() => {
    if (chat_id.trim()) {
      setMessageList([]); // Clear the message list before fetching
      resetPagination();
      fetchChatMessages();
    }
  }, [chat_id]);

  return { messages, loading, addMessage, removeMessage, fetchChatMessages, isFetchingOlder };
}
