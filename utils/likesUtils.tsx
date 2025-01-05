// likesUtils.ts
import { supabase } from '@/lib/supabase';

export const fetchLikeCount = async (chatId: string, itemId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('likes')
      .select('id', { count: 'exact', head: true })
      .eq('chat_id', chatId)
      .eq('item_id', itemId);

    if (error) {
      // console.error('Error fetching like count:', error);
      return 0; // Return 0 if there's an error
    }

    return count || 0; // Return the total count
  } catch (error) {
    // console.error('Error fetching like count:', error);
    return 0;
  }
};

export const hasUserLiked = async (userId: string, chatId: string, itemId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('chat_id', chatId)
      .eq('item_id', itemId)
      .maybeSingle(); // Returns null if no match

    if (error) {
      console.error('Error checking if user has liked:', error);
      return false; // Assume not liked if there's an error
    }

    return !!data; // True if data exists
  } catch (error) {
    console.error('Error checking if user has liked:', error);
    return false;
  }
};

export const toggleLike = async (userId: string, chatId: string, itemId: string): Promise<{ liked: boolean }> => {
  try {
    // Check if the user has already liked the item
    const { data: existingLike, error } = await supabase
      .from('likes')
      .select('id')
      .eq('user_id', userId)
      .eq('chat_id', chatId)
      .eq('item_id', itemId)
      .maybeSingle();

    if (error) {
      console.error('Error checking existing like:', error);
      throw error;
    }

    if (existingLike) {
      // Unlike the item
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        console.error('Error deleting like:', deleteError);
        throw deleteError;
      }

      return { liked: false };
    } else {
      // Like the item
      const { error: insertError } = await supabase
        .from('likes')
        .insert({
          user_id: userId,
          chat_id: chatId,
          item_id: itemId,
        });

      if (insertError) {
        console.error('Error inserting like:', insertError);
        throw insertError;
      }

      return { liked: true };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};


// Subscribe to like changes for a specific item
export const subscribeToLikes = (itemId: string, callback: (payload: any) => void) => {
  const channel = supabase.channel(`public:likes:item_id=eq.${itemId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'likes', filter: `item_id=eq.${itemId}` },
      callback
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'likes', filter: `item_id=eq.${itemId}` },
      callback
    )
    .subscribe();

  return channel;
};
