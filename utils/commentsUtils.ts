// src/utils/commentsUtils.ts
import { supabase } from '@/lib/supabase';

export interface Comment {
  id: string;
  chat_id: string;
  item_id: string;
  user_id: string;
  text: string;
  timestamp: string;
}

// Fetch the count of comments for an item
export const fetchCommentCount = async (chatId: string, itemId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('comments')
      .select('id', { count: 'exact', head: true })
      .eq('chat_id', chatId)
      .eq('item_id', itemId);

    if (error) {
      // console.error('Error fetching comment count:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    // console.error('Error fetching comment count:', error);
    return 0;
  }
};

// Add a new comment
export const addComment = async (
  chatId: string,
  itemId: string,
  userId: string,
  text: string
): Promise<Comment> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          chat_id: chatId,
          item_id: itemId,
          user_id: userId,
          text: text,
          timestamp: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Error adding comment:', error);
      throw error;
    }

    if (data && data.length > 0) {
      return data[0] as Comment;
    } else {
      throw new Error('No data returned after inserting comment.');
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

// Fetch all comments for an item
export const fetchComments = async (chatId: string, itemId: string): Promise<Comment[]> => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('chat_id', chatId)
      .eq('item_id', itemId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }

    return data as Comment[];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
