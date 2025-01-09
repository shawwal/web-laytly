import { supabase } from "@/lib/supabase";

export const updateChatList = async (
  chat_id: string,
  lastMessageContent: string,
  sender_id: string,
  recipient_activity: boolean
) => {
  try {
    // Fetch the current chat data
    const { data: chatData, error: chatFetchError } = await supabase
      .from('chats')
      .select('user_id, friend_id')
      .eq('id', chat_id)
      .single();

    if (chatFetchError) {
      console.error('Error fetching chat data:', chatFetchError);
      return;
    }

    // Update chat details (last message and timestamp)
    const { error: chatUpdateError } = await supabase
      .from('chats')
      .update({
        last_message: lastMessageContent,
        timestamp: new Date().toISOString(), // Use ISO string for consistency
      })
      .eq('id', chat_id);

    if (chatUpdateError) {
      console.error('Error updating chat details:', chatUpdateError);
      return;
    }

    // Determine which user's unread count to update
    const isSenderCurrentUser = chatData.user_id === sender_id;
    const targetUserId = isSenderCurrentUser ? chatData.friend_id : chatData.user_id;

    // Update the unread count in chat_user_unread
    if (!recipient_activity) {
      // console.log('triggered')

      const { data: unreadData, error: unreadFetchError } = await supabase
        .from('chat_user_unread')
        .select('unread_count')
        .eq('chat_id', chat_id)
        .eq('user_id', targetUserId);

      if (unreadFetchError) {
        console.error('Error fetching unread count:', unreadFetchError);
        return;
      }
      // console.log('unreadData', unreadData)
      const currentUnreadCount = unreadData.length > 0
        ? unreadData[0].unread_count
        : 0;

      // console.log('currentUnreadCount', currentUnreadCount)

      const { error: unreadUpdateError } = await supabase
        .from('chat_user_unread')
        .upsert({
          chat_id: chat_id,
          user_id: targetUserId,
          unread_count: currentUnreadCount + 1,
        });

      if (unreadUpdateError) {
        console.error('Error updating unread count:', unreadUpdateError);
      }
    }
  } catch (error) {
    console.error('Unexpected error in updateChatList:', error);
  }
};