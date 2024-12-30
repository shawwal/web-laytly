export interface Chat {
  id: string;         // Chat ID (UUID)
  user_id: string;    // User ID (UUID)
  friend_id: string;  // Friend ID (UUID)
  last_message: string; // Last message in chat
  timestamp: string;  // Timestamp of the last activity in the chat
  is_group: boolean;  // Whether it's a group chat
  name: string;       // Chat name (either friend name or group name)
  avatar_url: string; // Avatar URL for the chat
}