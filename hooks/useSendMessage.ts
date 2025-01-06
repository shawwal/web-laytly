import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useProfile } from "@/hooks/useProfile";

export function useSendMessage(chatId: string, addMessage: Function) {
  const [isSending, setIsSending] = useState(false);
  const { currentProfile } = useProfile();

  const sendMessage = useCallback(
    async (content: string, audioBlob?: Blob, images?: File[]) => {
      if (!chatId || isSending) return;

      setIsSending(true);

      const optimisticMessage = {
        id: uuidv4(),
        content,
        sender_id: currentProfile?.id,
        timestamp: new Date().toISOString(),
        status: "sending",
        is_forwarded: false,
        original_message_id: null,
        reply_to: null,
        reply_to_id: null,
        sender: {
          id: currentProfile?.id,
          username: currentProfile?.username || "Unknown",
          email: currentProfile?.email || "unknown@example.com",
          avatar_url: currentProfile?.avatar_url || "default-avatar.jpg",
        },
      };

      addMessage(optimisticMessage);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsSending(false);
      }
    },
    [chatId, isSending, addMessage, currentProfile]
  );

  return { sendMessage };
}
