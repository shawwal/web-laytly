export interface Message {
  id: string;               // UUID for the message
  chat_id: string;          // UUID for the associated chat
  sender_id: string;        // UUID of the sender (likely links to Profile)
  content: string;          // Message content (text)
  timestamp: string;        // Timestamp with time zone when the message was sent
  group_chat_id?: string;   // UUID for group chat (optional)
  is_forwarded?: boolean;   // Boolean to check if the message was forwarded
  original_message_id?: string; // UUID of the original message (if forwarded)
  reply_to_id?: string;     // UUID of the message being replied to
  thread_id?: number;       // Integer thread ID for a conversation thread (optional)
  status?: string;          // Status of the message (e.g., "sent", "delivered")
  type?: string;            // Type of the message (e.g., "text", "image")
  deleted_at?: string;      // Timestamp when the message was deleted (optional)
  edited_at?: string;       // Timestamp when the message was edited (optional)
  media_url?: string;       // URL for media attached to the message (optional)
  reaction?: string;        // Reaction (e.g., emoji or reaction text) (optional)
  reply_to?: string;        // UUID of the message being replied to (optional)
  sync_timestamp?: string;  // Timestamp when the message was synchronized (optional)
}
