import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabase";

export function useSendMessage(chatId: string, addMessage: (message: any) => void) {
  const [isSending, setIsSending] = useState(false);
  const { currentProfile } = useProfile();

  const sendMessage = useCallback(
    async (content: string, audioBlob?: Blob, images?: File[]) => {
      if (!chatId || isSending || !currentProfile) return;

      setIsSending(true);

      // Constructing optimistic message
      const optimisticMessage = {
        id: uuidv4(),
        content,
        sender_id: currentProfile?.id,
        timestamp: new Date().toISOString(),
        status: "sending",  // Mark as 'sending' initially
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
      try {
        // Insert message into Supabase
        const { data, error } = await supabase
          .from("messages")
          .insert([
            {
              chat_id: chatId,
              sender_id: currentProfile.id,
              content,
              timestamp: new Date().toISOString(),
              status: "sent",  // Set status to 'sent' in the DB
              is_forwarded: false,
              original_message_id: null,
              reply_to: null,
              reply_to_id: null,
            },
          ])
          .select(`
            id,
            content,
            timestamp,
            sender_id,
            is_forwarded,
            original_message_id,
            reply_to_id,
            status,
            sender:profiles!messages_sender_id_fkey (
              id,
              username,
              email
            )
          `)
          .single(); // We expect only one message to be inserted

        if (error) {
          throw new Error(`Error inserting message: ${error.message}`);
        }
    
        if (!data) {
          throw new Error("Message data is null. Something went wrong with the insert.");
        }
        console.log('data', data)
        // Successfully inserted, replace optimistic message with actual one
        const sentMessage = { ...optimisticMessage, status: "sent", id: data.id };
        
        // Only update if the message is not already marked as 'sent'
        addMessage(sentMessage);

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
