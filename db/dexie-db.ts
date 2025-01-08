'use client'
import Dexie, { Table } from 'dexie';
import { Profile } from '@/models/profile';
import { Message } from '@/models/message';
import { Chat } from '@/models/chat';

class MyAppDatabase extends Dexie {
  profiles: Table<Profile, string>;
  messages: Table<Message, string>;
  chats: Table<Chat, string>;

  constructor() {
    super('MyAppDatabase');

    this.version(1).stores({
      profiles: 'id, username, full_name, avatar_url, banner_url, website, phone_number, email, expo_push_token, storage_used, total_storage, updated_at',
      messages: 'id, chat_id, sender_id, content, timestamp, group_chat_id, is_forwarded, original_message_id, reply_to_id, thread_id, status, type, deleted_at, edited_at, media_url, reaction, reply_to, sync_timestamp',
      chats: '++id, user_id, friend_id, last_message, timestamp, is_group, name, avatar_url, unread_count, [chat_id+user_id]',
    });

    this.profiles = this.table('profiles');
    this.messages = this.table('messages');
    this.chats = this.table('chats');
  }

  async clearAllData() {
    try {
      this.close();
      await Dexie.delete('MyAppDatabase');
      console.log('All data cleared successfully.');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}

const db = new MyAppDatabase();
export default db;