export interface Chat {
  id: string;         // Chat ID (UUID)
  user_id: string;    // User ID (UUID)
  friend_id: string;  // Friend ID (UUID)
  lastMessageTime?: string; // Last message in chat
  last_message: string;
  lastMessage?: string;
  timestamp: string;  // Timestamp of the last activity in the chat
  is_group: boolean;  // Whether it's a group chat
  name: string;       // Chat name (either friend name or group name)
  avatar_url: string; // Avatar URL for the chat
  unread_count: number; // Number of unread messages
  unreadCount?: number;
}