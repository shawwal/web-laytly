// src/db/utils/updateUnreadCountLocally.ts
import db from '@/db/dexie-db'; // Import your Dexie DB instance

export const updateUnreadCountLocally = async (chatId: string, unreadCount: number) => {
  try {
    // Update the unread_count for the specific chat_id in the chats table
    await db.chats.update(chatId, { unread_count: unreadCount });

    // console.log(`Successfully updated unread_count for chat ${chatId} to ${unreadCount}`);
  } catch (error) {
    console.error('Error updating unread count locally in Dexie DB:', error);
  }
};
