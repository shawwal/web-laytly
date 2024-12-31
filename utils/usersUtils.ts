// utils/userUtils.ts
import { supabase } from '@/lib/supabase';

// Utility function to check if a UUID is valid
export const isValidUUID = (uuid: string) => {
  const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(uuid);
};

// Fetch friend and blocked status
export const fetchStatuses = async (userId: string, currentUserId: string) => {
  try {
    // Check friend status
    const { data: friendsData, error: friendsError } = await supabase
      .from('friends')
      .select('user_id, friend_id')
      .eq('user_id', currentUserId)
      .eq('friend_id', userId);

    if (friendsError) throw friendsError;

    // Check blocked status
    const { data: blockedData, error: blockedError } = await supabase
      .from('blocked_users')
      .select('user_id, blocked_user_id')
      .eq('user_id', currentUserId)
      .eq('blocked_user_id', userId);

    if (blockedError) throw blockedError;

    return {
      isFriend: friendsData.length > 0,
      isBlocked: blockedData.length > 0,
    };
  } catch (error) {
    console.error('Error fetching statuses:', error.message);
    return { isFriend: false, isBlocked: false };
  }
};

// Block a user
export const handleBlockUser = async (userId: string, currentUserId: string) => {
  try {
    const { error } = await supabase
      .from('blocked_users')
      .insert([{ user_id: currentUserId, blocked_user_id: userId }]);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error blocking user:', error.message);
    return false;
  }
};

// Unblock a user
export const handleUnblockUser = async (userId: string, currentUserId: string) => {
  try {
    const { error } = await supabase
      .from('blocked_users')
      .delete()
      .eq('user_id', currentUserId)
      .eq('blocked_user_id', userId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error unblocking user:', error.message);
    return false;
  }
};


export const checkFriendExists = async (userId: string, currentUserId: string) => {
  try {
    const { data: existingFriend, error } = await supabase
      .from('friends')
      .select('user_id, friend_id')
      .eq('user_id', currentUserId)
      .eq('friend_id', userId);

    if (error) throw error;

    return existingFriend.length > 0;
  } catch (error) {
    console.error('Error checking if friend exists:', error.message);
    return false;
  }
};

// Add a friend
export const handleAddFriend = async (userId: string, currentUserId: string) => {
  try {
    const friendExists = await checkFriendExists(userId, currentUserId);
    
    if (friendExists) {
      console.log('Friend already exists.');
      return false; // Return false if the friend relationship already exists
    }

    const { error } = await supabase
      .from('friends')
      .insert([{ user_id: currentUserId, friend_id: userId }]);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error adding friend:', error.message);
    return false;
  }
};