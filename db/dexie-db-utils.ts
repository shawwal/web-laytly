import db from '@/db/dexie-db';

/**
 * Resets the Dexie DB tables to default values if necessary
 * Avoid using .clear() if data is needed
 */
export const resetDexieDb = async () => {
  try {
    // Check if the tables already have data before inserting default records
    const profilesExist = await db.profiles.count() > 0;
    const chatsExist = await db.chats.count() > 0;
    const messagesExist = await db.messages.count() > 0;

    // If no profiles exist, add default profile
    if (!profilesExist) {
      await db.profiles.add({
        id: 'default', 
        username: 'defaultUser',
        email: 'default@example.com',
        avatar_url: 'default_avatar.png',
        full_name: 'Default User',
        banner_url: '',
        website: '',
        phone_number: '',
        expo_push_token: '',
        storage_used: 0,
        total_storage: 1000,
        updated_at: new Date().toISOString()
      });
    }

    // If no chats exist, add default chat
    if (!chatsExist) {
      await db.chats.add({
        id: 'default_chat',
        user_id: 'default',
        friend_id: 'default',
        last_message: 'Welcome to your first chat!',
        timestamp: new Date().toISOString(),
        is_group: false,
        name: 'Default Chat',
        avatar_url: 'default_chat_avatar.png',
        unread_count: 0,
        lastMessageTime: '',
        lastMessage: '',
        unreadCount: 0
      });
    }

    // If no messages exist, add default message
    if (!messagesExist) {
      await db.messages.add({
        id: 'default_message',
        chat_id: 'default_chat',
        sender_id: 'default',
        content: 'Hello!',
        timestamp: new Date().toISOString(),
        group_chat_id: undefined, // Use undefined instead of null
        is_forwarded: false,
        original_message_id: undefined, // Use undefined instead of null
        reply_to_id: undefined, // Use undefined instead of null
        thread_id: undefined, // Use undefined instead of null
        status: 'sent',
        type: 'text',
        deleted_at: undefined, // Use undefined instead of null
        edited_at: undefined, // Use undefined instead of null
        media_url: undefined, // Use undefined instead of null
        reaction: undefined, // Use undefined instead of null
        reply_to: undefined, // Use undefined instead of null
        sync_timestamp: new Date().toISOString(),
        sender: {
          id: 'default',
          username: 'defaultUser',
          email: '',
          avatar_url: ''
        } // Provide a valid value for the sender property
      });
    }

    console.log("Dexie DB reset successfully.");
  } catch (error) {
    console.error("Error resetting Dexie DB:", error);
  }
};
