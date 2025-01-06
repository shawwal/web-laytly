// hooks/useChatMessages.ts
import { useState, useEffect } from "react";
import { useMessageState } from "@/hooks/useMessageState";
import { usePagination } from "@/hooks/usePagination";
import { fetchMessages } from "@/hooks/useFetchMessages";

interface ChatParams {
  chat_id: string;
}

export function useChatMessages({ chat_id }: ChatParams) {
  const { messages, addMessage, removeMessage, setMessageList } = useMessageState();
  const { currentOffset, limit, fetchOlderMessages, resetPagination } = usePagination();
  const [loading, setLoading] = useState(true);
  const [isFetchingOlder, setIsFetchingOlder] = useState(false);

  const fetchChatMessages = async (isOlderFetch = false) => {
    if (!chat_id || chat_id.trim() === '') {
      setLoading(false);
      return;
    }

    setLoading(true);
    if (isOlderFetch) {
      setIsFetchingOlder(true);
    }

    try {
      const newMessages = await fetchMessages({ chatId: chat_id, limit, currentOffset });
      setMessageList(prevMessages => {
        const uniqueMessages = [
          ...newMessages.filter(msg => !prevMessages.some(existingMsg => existingMsg.id === msg.id)),
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

  useEffect(() => {
    if (chat_id.trim()) {
      setMessageList([]);
      resetPagination();
      fetchChatMessages();
    }
  }, [chat_id]);

  return { messages, loading, addMessage, removeMessage, fetchChatMessages, isFetchingOlder };
}
