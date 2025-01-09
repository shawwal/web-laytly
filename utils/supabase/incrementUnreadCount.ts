import { supabase } from "@/lib/supabase";

// Function to increment unread count for a chat user
async function incrementUnreadCount(chat_id: number, targetUserId: number): Promise<void> {
  try {
    // Fetch the current unread count
    const { data, error: unreadFetchError } = await supabase
      .from('chat_user_unread')
      .select('unread_count')
      .eq('chat_id', chat_id)
      .eq('user_id', targetUserId);

    if (unreadFetchError) {
      console.error('Error fetching unread count:', unreadFetchError);
      throw new Error('Unable to fetch unread count');
    }

    const currentUnreadCount = data?.length > 0 ? data[0].unread_count : 0;
    const newUnreadCount = currentUnreadCount + 1;

    // Update the unread count
    const { error: unreadUpdateError } = await supabase
      .from('chat_user_unread')
      .upsert({
        chat_id,
        user_id: targetUserId,
        unread_count: newUnreadCount,
      });

    if (unreadUpdateError) {
      console.error('Error updating unread count:', unreadUpdateError);
      throw new Error('Unable to update unread count');
    }

    console.log(`Unread count updated successfully: ${newUnreadCount}`);
  } catch (error) {
    console.error('Error in incrementUnreadCount:', error);
  }
}

export default incrementUnreadCount;
