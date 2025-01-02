import Dexie, { Table } from 'dexie';
import { Profile } from '@/models/profile';     // Import Profile interface
import { Message } from '@/models/message';     // Import Message interface
import { Chat } from '@/models/chat';           // Import Chat interface

class MyAppDatabase extends Dexie {
  profiles: Table<Profile, string>;  // Profile table with 'id' as the primary key
  messages: Table<Message, string>;  // Messages table with 'id' as the primary key
  chats: Table<Chat, string>;        // Chats table with 'id' as the primary key

  constructor() {
    super('MyAppDatabase');
    
    // Defining the schema for all tables
    this.version(1).stores({
      profiles: 'id, username, full_name, avatar_url, banner_url, website, phone_number, email, expo_push_token, storage_used, total_storage, updated_at',
      messages: 'id, chat_id, sender_id, content, timestamp, group_chat_id, is_forwarded, original_message_id, reply_to_id, thread_id, status, type, deleted_at, edited_at, media_url, reaction, reply_to, sync_timestamp', // All message fields
      chats: 'id, user_id, friend_id, last_message, timestamp, is_group, name, avatar_url, unread_count', // Chat structure
    });

    // Map tables to Dexie instances
    this.profiles = this.table('profiles');
    this.messages = this.table('messages');
    this.chats = this.table('chats');
  }
}

// Instantiate the database
const db = new MyAppDatabase();
export default db;
