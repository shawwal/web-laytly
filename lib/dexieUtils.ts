import db from '@/db/dexie-db';

/**
 * Clears all data from specified tables in the Dexie database 
 * and closes the database connection.
 */
export const clearDexieDbDataAndClose = async () => {
  try {
    await db.transaction('rw', db.profiles, db.messages, db.chats, async () => {
      await db.profiles.clear();
      await db.messages.clear();
      await db.chats.clear();
    });

    // Close the existing database connection
    await db.close(); 

    console.log("Dexie DB data cleared and connection closed successfully.");
    await db.open(); 
    console.log("Open successfully.");
  } catch (error) {
    console.error("Error clearing Dexie DB data:", error);
  }
};