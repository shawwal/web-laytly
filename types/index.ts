interface User {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  confirmed_at: string;
  recovery_sent_at: string;
  last_sign_in_at: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    phone_verified: boolean;
    picture: string;
    provider_id: string;
    sub: string;
  };
  identities: {
    identity_id: string;
    id: string;
    user_id: string;
    identity_data: {
      email: string;
      email_verified: boolean;
      phone_verified: boolean;
      sub: string;
    };
    provider: string;
    last_sign_in_at: string;
    created_at: string;
    updated_at: string;
    email: string;
  }[];
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

export interface Session {
  user: User;
}
export interface MediaItem {
  id: string;
  imageUrl: string;
  likes: number;
  comments: number;
  saved: boolean;
  liked: boolean;
  caption?: string;
  user: {
    name: string;
    avatar: string;
    username: string;
  };
  timestamp: Date;
}

export interface MonthGroup {
  month: string;
  items: MediaItem[];
}
export interface Album {
  id: string;              // Unique identifier for the album
  chat_id: string;         // ID associated with the chat
  cover_image: string;     // Path to the cover image
  created_at: string;      // Date when the album was created
  updated_at: string;      // Date when the album was last updated
  name: string;            // Name of the album
  item_count: number;      // Number of items (photos or videos) in the album
}
export interface Sender {
  id: string
  email: string
  username: string
  avatar_url: string
}
export interface ChatMessage {
  id: string
  content: string
  is_forwarded: boolean
  original_message_id: string | null
  reply_to: string | null
  reply_to_id: string | null
  sender: Sender
  sender_id: string
  timestamp: string
  unreadCount: number
}
