// hooks/useChatMessages.ts
import { useState, useEffect } from "react";
import { useMessageState } from "@/hooks/useMessageState";
import { usePagination } from "@/hooks/usePagination";
import { fetchMessages } from "@/hooks/useFetchMessages";
import useSenderDetails from '@/hooks/useSenderDetails';
import { supabase } from "@/lib/supabase";
import db from "@/db/dexie-db"; // Import Dexie DB
import { useLiveQuery } from 'dexie-react-hooks'; // Import useLiveQuery hook from dexie-react-hooks

interface ChatParams {
  chat_id: string;
}

export function useChatMessages({ chat_id }: ChatParams) {
  const { messages, addMessage, editMessage, removeMessage, setMessageList } = useMessageState();
  const { currentOffset, limit, fetchOlderMessages, resetPagination } = usePagination();
  const [loading, setLoading] = useState(true);
  const [isFetchingOlder, setIsFetchingOlder] = useState(false);
  const { fetchSenderDetails } = useSenderDetails();

  // Use `useLiveQuery` to listen for updates from Dexie DB
  const liveMessages = useLiveQuery(() => db.messages.where("chat_id").equals(chat_id).toArray(), [chat_id]);

  // Fetch chat messages from Supabase (initial load)
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

    try {
      const newMessages = await fetchMessages({ chatId: chat_id, limit, currentOffset });
      setMessageList((prevMessages) => {
        const uniqueMessages = [
          ...newMessages.filter(msg => !prevMessages.some((existingMsg: any) => existingMsg.id === msg.id)),
          ...prevMessages,
        ];
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

    const handleNewMessage = async (payload: any) => {
      const senderData = await fetchSenderDetails(payload.new.sender_id);
      const newMessage = { ...payload.new, sender: senderData };

      // Only add the new message if it doesn't already exist in local state
      if (!messages.some((msg: any) => msg.id === newMessage.id)) {
        addMessage(newMessage);
      }
    };

    const handleUpdateMessage = async (payload: any) => {
      const updatedMessage = payload.new;
      editMessage(updatedMessage); // Update or replace the message
    };

    const handleDeleteMessage = async (payload: any) => {
      const deletedMessageId = payload.old.id;
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
      channel.unsubscribe();
    };
  }, [chat_id, messages, addMessage, editMessage, removeMessage, fetchSenderDetails]);

  // Fetch messages on initial load or when `chat_id` changes
  useEffect(() => {
    if (chat_id.trim()) {
      setMessageList([]); // Clear the message list before fetching
      resetPagination();
      fetchChatMessages();
    }
  }, [chat_id]);

  // Use live messages from Dexie DB to update the local state automatically
  useEffect(() => {
    if (liveMessages && liveMessages.length > 0) {
      setMessageList(liveMessages); // Update state with live data from Dexie DB
    }
  }, [liveMessages]);

  return { messages, loading, addMessage, removeMessage, fetchChatMessages, isFetchingOlder };
}
