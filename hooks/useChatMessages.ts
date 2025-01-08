import { useState, useEffect, useCallback } from "react";
import { useMessageState } from "@/hooks/useMessageState";
import { usePagination } from "@/hooks/usePagination";
import { fetchMessages } from "@/hooks/useFetchMessages";
import useSenderDetails from "@/hooks/useSenderDetails";
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
  const [channel, setChannel] = useState<any>(null);

  const fetchChatMessages = async (isOlderFetch = false) => {
    if (!chat_id || chat_id.trim() === "") {
      console.log("No chat_id provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    if (isOlderFetch) {
      setIsFetchingOlder(true);
    }

    try {
      console.log("Fetching chat messages (isOlderFetch:", isOlderFetch, ")");
      const newMessages = await fetchMessages({ chatId: chat_id, limit, currentOffset });

      const uniqueMessages = newMessages.filter(
        (newMsg) => !messages.some((existingMsg) => existingMsg.id === newMsg.id && existingMsg.timestamp === newMsg.timestamp)
      );

      const sortedNewMessages = uniqueMessages.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });

      if (!isOlderFetch) {
        setMessageList((prevMessages) => [...prevMessages, ...sortedNewMessages]);
      }

      if (isOlderFetch) {
        fetchOlderMessages();
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    } finally {
      setLoading(false);
      setIsFetchingOlder(false);
    }
  };

  const handleNewMessage = useCallback(async (payload: any) => {
    console.log("handleNewMessage: New message received:", payload);
    try {
      const senderData = await fetchSenderDetails(payload.new.sender_id);
      const newMessage = { ...payload.new, sender: senderData };

      if (!messages.some((msg) => msg.id === newMessage.id && msg.timestamp === newMessage.timestamp)) {
        console.log("Adding new message to state:", newMessage);
        addMessage(newMessage);
      } else {
        console.log("Duplicate message received, ignoring.");
      }
    } catch (error) {
      console.error("Error handling new message:", error);
    }
  }, [messages, addMessage, fetchSenderDetails]);

  const handleUpdateMessage = useCallback((payload: any) => {
    console.log("handleUpdateMessage: Message updated:", payload);
    const updatedMessage = payload.new;
    editMessage(updatedMessage);
  }, [editMessage]);

  const handleDeleteMessage = useCallback((payload: any) => {
    console.log("handleDeleteMessage: Message deleted:", payload);
    const deletedMessageId = payload.old.id;
    removeMessage(deletedMessageId);
  }, [removeMessage]);

  useEffect(() => {
    if (!chat_id.trim()) {
      console.log("chat_id is empty, skipping subscription setup.");
      if (channel) {
        console.log("Unsubscribing from existing channel.");
        channel.unsubscribe();
        setChannel(null);
      }
      return;
    }

    console.log("Setting up Supabase real-time subscription for chat_id:", chat_id);

    if (channel) {
      console.log("Unsubscribing from existing channel before creating a new one.");
      channel.unsubscribe();
    }

    const newChannel = supabase
      .channel(`public:messages:chat_id=eq.${chat_id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `chat_id=eq.${chat_id}` }, handleNewMessage)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages", filter: `chat_id=eq.${chat_id}` }, handleUpdateMessage)
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "messages", filter: `chat_id=eq.${chat_id}` }, handleDeleteMessage)
      .subscribe();

    setChannel(newChannel);

    return () => {
      console.log("Component unmounting or chat_id changed, unsubscribing from channel.");
      if (newChannel) {
        newChannel.unsubscribe();
      }
    };
  }, [chat_id, handleNewMessage, handleUpdateMessage, handleDeleteMessage]);

  useEffect(() => {
    if (chat_id.trim()) {
      console.log("chat_id changed, resetting message list and pagination.");
      setMessageList([]);
      resetPagination();
      fetchChatMessages();
    }
  }, [chat_id]);

  return { messages, loading, addMessage, removeMessage, fetchChatMessages, isFetchingOlder };
}