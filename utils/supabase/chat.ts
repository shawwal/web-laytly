import { supabase } from '@/lib/supabase'; // Assuming Supabase client is set up
import { Chat } from '@/models/chat'; // Assuming you have a Chat model
import db from '@/db/dexie-db'; 
/**
 * Fetches chat list for the current user including individual and group chats.
 * 
 * @returns A list of chats including unread counts.
 */
export const fetchChatsFromSupabase = async (): Promise<Chat[]> => {
  try {
    // Fetch the current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('Session not found or invalid:', sessionError);
      return []; // Return an empty array if no session is found
    }

    const sessionUserId = session.user.id; // Extract user ID from the session

    if (!sessionUserId) {
      console.error('Session User ID is not available. Waiting for session...');
      return []; // Return empty array or handle as per your requirement
    }

    // Fetch individual chats where the user is either the sender or the receiver
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .select(`
        id,
        friend_id,
        user_id,
        last_message,
        timestamp,
        is_group,
        avatar_url,
        name
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
          timestamp: chat.timestamp ? new Date(chat.timestamp).toISOString() : '',
          unreadCount: chat.unread_count || 0,
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
          console.error('Error fetching unread count for individual chat:', unreadError);
          return null;
        }

        // Handle unread count, ensuring data integrity
        const unreadCount = unreadData.length === 1 ? unreadData[0].unread_count : 0;

        return {
          id: chat.id,
          name: userProfile.username || userProfile.email || 'Unknown',
          lastMessage: chat.last_message || 'No message',
          timestamp: chat.timestamp ? new Date(chat.timestamp).toISOString() : '',
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
          timestamp: chat.timestamp ? new Date(chat.timestamp).toISOString() : '',
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

    // Log individual and group chat data before combining
    // console.log('Individual Chats:', individualChats);
    // console.log('Group Chats:', groupChats);

    // Combine individual and group chats
    const allChats = [
      ...individualChats.filter(chat => chat !== null),
      ...groupChats.filter(chat => chat !== null)
    ];

    // Log all chats before deduplication
    // console.log('All Chats (Before Deduplication):', allChats);

    // Remove duplicates by ensuring unique chat IDs
    const uniqueChats = Array.from(
      new Map(allChats.map(chat => [chat.id, chat])).values()
    );

    // Log unique chats
    // console.log('Unique Chats:', uniqueChats);

    // Sort by timestamp, descending (most recent first)
    const sortedChats = uniqueChats
      .filter(chat => chat.timestamp) // Ensure no empty timestamps
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

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

export const updateChatInSupabase = async (chat: Chat) => {
  try {
    // Upsert the chat: Insert or update the chat in Supabase's 'chats' table
    const { data, error } = await supabase
      .from('chats')
      .upsert([chat]);

    if (error) {
      throw new Error(`Error updating chat in Supabase: ${error.message}`);
    }

    // Return the updated or inserted chat data
    return data;
  } catch (error) {
    console.error('Error updating chat in Supabase:', error);
    throw error;  // Rethrow error for further handling
  }
};

// Update a single chat in Supabase
export const insertMessageToSupabase = async (chat: Chat): Promise<void> => {
  try {
    const { error } = await supabase
      .from('chats')
      .insert([chat]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error updating chat in Supabase:', error);
    throw error; // Rethrow the error to propagate it
  }
};

// Insert message to Supabase
export const insertMessageToDexie = async (message: any) => {
  try {
    await db.messages.add(message);  // Insert the message into Dexie DB
  } catch (error) {
    console.error('Error inserting message into DexieDB:', error);
  }
};
interface FetchMessagesParams {
  chat_id: string;
  limit: number;
  offset: number;
}

// Fetch messages from Supabase for a given chat ID with pagination support
export const fetchMessagesFromSupabase = async ({ chat_id, limit, offset }: FetchMessagesParams) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        timestamp,
        sender_id,
        is_forwarded,
        original_message_id,
        reply_to,
        reply_to_id,
        sender:profiles!messages_sender_id_fkey (
          id,
          username,
          email,
          avatar_url
        )
      `)
      .eq('chat_id', chat_id)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error('Error fetching chat messages: ' + error.message);
    }

    const newMessages = data.map((message: any) => ({
      ...message,
      sender: message.sender || { username: 'Unknown User', email: 'unknown@example.com' },
    }));

    return newMessages;
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
};
