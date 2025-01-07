// src/utils/resetUnreadCount.ts
import { supabase } from '@/lib/supabase';
import { updateUnreadCountLocally } from '@/db/utils/updateUnreadCountLocally'; // Import the new utility function
import { getUnreadCountFromLocal } from '@/db/utils/getUnreadCountFromLocal'; // New utility to get the current unread count locally

// Define the ResetUnreadCountParams type
interface ResetUnreadCountParams {
  chatId: string;
  userId: string;
}

export const resetUnreadCount = async ({ chatId, userId }: ResetUnreadCountParams) => {
  // console.log('Triggered reset for unread count');
  let currentUnreadCount: number | null = null;

  try {
    // 1. Get the current unread count from the local Dexie DB before any updates
    currentUnreadCount = await getUnreadCountFromLocal(chatId, userId);

    // 2. Prioritize local update first to make the UI feel more responsive
    await updateUnreadCountLocally(chatId, 0); // Reset unread count to 0 locally

    // Fetch chat data to determine if the user is the sender or receiver
    const { data: chatData, error: chatFetchError } = await supabase
      .from('chats')
      .select('user_id, friend_id')
      .eq('id', chatId)
      .single();

    if (chatFetchError) {
      console.error('Error fetching chat data:', chatFetchError);
      return;
    }

    const isSender = chatData.user_id === userId;
    const isReceiver = chatData.friend_id === userId;

    if (!isSender && !isReceiver) {
      // If user is neither the sender nor the receiver, do not proceed
      return;
    }

    // 3. Reset the unread count for the user in the chat_user_unread table (in Supabase)
    const { error: upsertError } = await supabase
      .from('chat_user_unread')
      .upsert({
        chat_id: chatId,
        user_id: userId,
        unread_count: 0
      });

    if (upsertError) {
      console.error('Error resetting unread count in Supabase:', upsertError);
      // 4. If the backend update fails, restore the local unread count to the previous value
      if (currentUnreadCount !== null) {
        await updateUnreadCountLocally(chatId, currentUnreadCount); // Restore the original unread count locally
      }
    } else {
      // console.log('Successfully reset unread count in Supabase');
    }
  } catch (error) {
    console.error('Unexpected error in resetUnreadCount:', error);
    // If there's any unexpected error, also restore the local unread count
    if (currentUnreadCount !== null) {
      await updateUnreadCountLocally(chatId, currentUnreadCount); // Restore the original unread count locally
    }
  }
};
