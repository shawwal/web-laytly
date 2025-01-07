import { supabase } from '@/lib/supabase';

// Define the ResetUnreadCountParams type
interface ResetUnreadCountParams {
  chatId: string;
  userId: string;
}

export const resetUnreadCount = async ({ chatId, userId }: ResetUnreadCountParams) => {
  console.log('triggered reset')
  try {
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
      // console.error('User is neither sender nor receiver');
      return;
    }

    // Reset the unread count for the user in the chat_user_unread table
    const { error: upsertError } = await supabase
      .from('chat_user_unread')
      .upsert({
        chat_id: chatId,
        user_id: userId,
        unread_count: 0
      });

    if (upsertError) {
      console.error('Error resetting unread count:', upsertError);
    } else {
      // console.log('Unread count reset successfully');
    }
  } catch (error) {
    console.error('Unexpected error in resetUnreadCount:', error);
  }
};
