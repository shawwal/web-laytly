import db from '@/db/dexie-db';

/**
 * Clears all tables in the Dexie database
 */
export const clearDexieDb = async () => {
  try {
    // Clear all the tables in the Dexie DB
    await db.profiles.clear();
    await db.messages.clear();
    await db.chats.clear();

    console.log("Dexie DB cleared successfully.");
  } catch (error) {
    console.error("Error clearing Dexie DB:", error);
  }
};
