/* eslint-disable @typescript-eslint/no-explicit-any */
// /utils/supabase/chat.ts
import { supabase } from '@/lib/supabase'; // Assuming Supabase client is set up
import { Chat } from '@/models/chat'; // Assuming you have a Chat model

/**
 * Fetches chat list for the current user including individual and group chats.
 * 
 * @param sessionUserId - User ID to fetch chats for.
 * @returns A list of chats including unread counts.
 */
export const fetchChatsFromSupabase = async (sessionUserId: string): Promise<Chat[]> => {
  try {
    // Fetch individual chats where the user is either the sender or the receiver
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .select(`
        id,
        friend_id,
        user_id,
        last_message,
        timestamp,
        is_group
      `)
      .or(`user_id.eq.${sessionUserId},friend_id.eq.${sessionUserId}`)
      .order('timestamp', { ascending: false });

    if (chatError) {
      console.error('Error fetching chat data:', chatError);
      throw new Error(chatError.message);
    }

    // Fetch unread counts for individual chats
    const individualChats = await Promise.all(chatData.map(async (chat: any) => {
      // Skip chats with missing required fields
      if (!chat.is_group && (!chat.user_id || !chat.friend_id)) return null;

      // Determine the profile ID based on the current user
      const profileId = chat.user_id === sessionUserId ? chat.friend_id : chat.user_id;

      // Skip profile fetch if this is a group chat (group chats don't have profiles)
      if (chat.is_group) {
        return {
          id: chat.id,
          name: chat.name || 'Group Chat',
          lastMessage: chat.last_message || 'No message',
          timestamp: new Date(chat.timestamp).toISOString(),
          unreadCount: 0,
          avatarUrl: chat.avatar_url || 'group.png',
          email: '',
          userId: sessionUserId,
          friendId: '',
          isGroup: true,
        };
      }

      // Check for invalid profile ID (null or not a valid UUID)
      if (!profileId || profileId === 'null') {
        console.warn('Skipping profile fetch for invalid profileId:', profileId, 'in chat:', chat);
        return null; // Skip this chat if the profile ID is invalid
      }

      try {
        // Fetch profile data for the chat's participant
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, avatar_url, email')
          .eq('id', profileId)
          .single();

        if (profileError) {
          console.error('Error fetching profile data:', profileError);
          return null;
        }

        const userProfile = profileData || { username: 'Unknown', avatar_url: 'default_avatar_url', email: 'unknown@example.com' };

        // Fetch unread count for this chat from the chat_user_unread table
        const { data: unreadData, error: unreadError } = await supabase
          .from('chat_user_unread')
          .select('unread_count')
          .eq('chat_id', chat.id)
          .eq('user_id', sessionUserId);

        if (unreadError) {
          console.error('Error fetching unread count:', unreadError);
          return null;
        }

        // Handle unread count, ensuring data integrity
        const unreadCount = unreadData.length === 1 ? unreadData[0].unread_count : 0;

        return {
          id: chat.id,
          name: userProfile.username || userProfile.email || 'Unknown',
          lastMessage: chat.last_message || 'No message',
          timestamp: new Date(chat.timestamp).toISOString(),
          unreadCount,
          avatarUrl: userProfile.avatar_url,
          email: userProfile.email,
          userId: sessionUserId,
          friendId: profileId,
          isGroup: false,
        };
      } catch (error) {
        console.error('Error processing individual chat:', error);
        return null;
      }
    }));

    // Fetch group chats where the user is a participant
    const { data: groupChatData, error: groupChatError } = await supabase
      .from('chats')
      .select(`
        id,
        name,
        timestamp,
        last_message,
        avatar_url
      `)
      .eq('is_group', true)
      .order('timestamp', { ascending: false });

    if (groupChatError) {
      console.error('Error fetching group chat data:', groupChatError);
      throw new Error(groupChatError.message);
    }

    // Fetch unread counts for group chats
    const groupChats = await Promise.all(groupChatData.map(async (chat) => {
      if (!chat.id) return null;

      try {
        // Check if the user is a member of the group chat
        const { data: membersData, error: membersError } = await supabase
          .from('chat_members')
          .select('user_id')
          .eq('chat_id', chat.id);

        if (membersError) {
          console.error('Error fetching group chat members:', membersError);
          return null;
        }

        const isMember = membersData.some(member => member.user_id === sessionUserId);
        if (!isMember) return null;

        // Fetch unread count for this group chat
        const { data: unreadData, error: unreadError } = await supabase
          .from('chat_user_unread')
          .select('unread_count')
          .eq('chat_id', chat.id)
          .eq('user_id', sessionUserId);

        if (unreadError) {
          console.error('Error fetching group unread count:', unreadError);
          return null;
        }

        // Handle unread count, ensuring data integrity
        const unreadCount = unreadData.length === 1 ? unreadData[0].unread_count : 0;

        return {
          id: chat.id,
          name: chat.name || 'Group Chat',
          lastMessage: chat.last_message || 'No message',
          timestamp: new Date(chat.timestamp).toISOString(),
          unreadCount,
          avatarUrl: chat?.avatar_url || 'group.png',
          email: '',
          userId: sessionUserId,
          friendId: '',
          isGroup: true,
        };
      } catch (error) {
        console.error('Error processing group chat:', error);
        return null;
      }
    }));

    // Combine and sort individual and group chats
    const allChats = [
      ...individualChats.filter(chat => chat !== null),
      ...groupChats.filter(chat => chat !== null)
    ];

    // Sort by timestamp, descending (most recent first)
    const sortedChats = allChats.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return sortedChats.map(chat => ({
      id: chat.id,
      name: chat.name,
      last_message: chat.lastMessage,
      timestamp: chat.timestamp,
      unread_count: chat.unreadCount,
      avatar_url: chat.avatarUrl,
      user_id: chat.userId,
      friend_id: chat.friendId,
      is_group: chat.isGroup
    }));
  } catch (error) {
    console.error('Error fetching chat list:', error);
    return [];  // Return an empty array in case of error
  }
};

// Update a single chat in Supabase
export const updateChatInSupabase = async (chat: Chat): Promise<void> => {
  try {
    const { error } = await supabase
      .from('chats')
      .upsert([chat]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error updating chat in Supabase:', error);
    throw error; // Rethrow the error to propagate it
  }
};
