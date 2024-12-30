export interface Message {
  id: string;               // UUID (primary key)
  chat_id: string;          // UUID (ID of the chat this message belongs to)
  sender_id: string;        // UUID (ID of the sender)
  content: string;          // Text (content of the message)
  timestamp: string;        // Timestamp (the time the message was sent)
  group_chat_id: string | null; // UUID (group chat ID, nullable)
  is_forwarded: boolean;    // Boolean (whether the message was forwarded)
  original_message_id: string | null; // UUID (original message ID, nullable)
  reply_to_id: string | null; // UUID (ID of the message being replied to, nullable)
  thread_id: number | null; // Integer (thread ID, nullable)
  status: string | null;    // Text (status of the message, nullable)
  type: string | null;      // Text (type of the message, nullable)
  deleted_at: string | null; // Timestamp (when deleted, nullable)
  edited_at: string | null; // Timestamp (when edited, nullable)
  media_url: string | null; // Text (media URL, nullable)
  reaction: string | null;  // Text (reaction to the message, nullable)
  reply_to: string | null;  // UUID (ID of the message being replied to, nullable)
}
