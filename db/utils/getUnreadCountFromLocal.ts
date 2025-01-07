// src/db/utils/getUnreadCountFromLocal.ts
import db from '@/db/dexie-db'; // Dexie instance

export const getUnreadCountFromLocal = async (chatId: string, userId: string): Promise<number | null> => {
  try {
    const chatUserUnread = await db.chats
      .where({ chat_id: chatId, user_id: userId })
      .first(); // Get the first entry matching the chatId and userId

    return chatUserUnread ? chatUserUnread.unread_count : null; // Return the unread count or null if not found
  } catch (error) {
    console.error('Error fetching unread count from local DB:', error);
    return null; // Return null in case of error
  }
};
