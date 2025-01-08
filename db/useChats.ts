// db/useChats.ts
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import db from '@/db/dexie-db'; // Import Dexie DB
import { useLiveQuery } from 'dexie-react-hooks'; // Import useLiveQuery hook from dexie-react-hooks
import { Chat } from '@/models/chat'; // Import the Chat model
import { fetchChatsFromSupabase } from '@/utils/supabase/chat'; // Function to fetch chats from Supabase

export const useChats = () => {
  const liveChats = useLiveQuery<Chat[]>(() => db.chats.toArray()); // Fetch chats from Dexie DB
  const [chats, setChats] = useState<Chat[]>([]); // State to hold the chats
  const [loading, setLoading] = useState<boolean>(true); // For loading state
  const [syncError, setSyncError] = useState<string | null>(null); // To handle errors during sync
  const [fetchedFromSupabase, setFetchedFromSupabase] = useState<boolean>(false); // To track if we already fetched chats from Supabase
  const [dexieLoading, setDexieLoading] = useState<boolean>(true); // Loading state for Dexie DB data
  // const { fetchSenderDetails } = useSenderDetails();
  // Initialize local chats from Dexie DB and also listen for changes
  useEffect(() => {
    // console.log('useEffect: liveChats changed or mounted');
    if (liveChats && liveChats.length > 0) {
      // console.log('useEffect: Dexie data available', liveChats);
      setDexieLoading(false); // Dexie data is ready, stop loading
      setChats(liveChats); // Set chats state with Dexie data
    } else {
      // console.log('useEffect: Dexie data not available, loading...');
      setDexieLoading(true); // If no chats are available in Dexie DB, set loading state
    }
  }, [liveChats]); // Re-run whenever liveChats changes (from Dexie DB)

  // Fetch chat list from Supabase only if Dexie DB is empty and hasn't been fetched from Supabase yet
  useEffect(() => {
    // console.log('useEffect: Checking if we need to fetch chats from Supabase');
    const fetchChats = async () => {
      // console.log('fetchChats: Starting to fetch from Supabase...');
      setLoading(true); // Set loading to true during the fetch
      try {
        const chatsFromSupabase = await fetchChatsFromSupabase(); // Fetch chats from Supabase
        // console.log('fetchChats: Successfully fetched chats from Supabase', chatsFromSupabase);
        // Store the fetched chats in Dexie DB and state
        await db.chats.bulkPut(chatsFromSupabase);
        setChats(chatsFromSupabase);
        setFetchedFromSupabase(true); // Mark as fetched
      } catch (error) {
        console.error('fetchChats: Error fetching chats from Supabase', error);
        setSyncError('Failed to load chats.');
      } finally {
        console.log('fetchChats: Finished fetching from Supabase');
        setLoading(false); // Stop loading when fetch is complete
      }
    };

    if (!fetchedFromSupabase && liveChats && liveChats.length === 0) {
      // console.log('useEffect: Fetching from Supabase because Dexie is empty');
      fetchChats(); // Fetch chats only if Dexie DB is empty and we haven't fetched from Supabase yet
    } else {
      // console.log('useEffect chat list: Supabase fetch skipped because chats are already fetched or Dexie has data');
      if (!dexieLoading) {
        setLoading(false); // No need to keep loading if Dexie has data
      }
    }
  }, [liveChats, fetchedFromSupabase, dexieLoading]); // Avoid re-fetching if we've already done it

  // Subscribe to chat updates using Supabase real-time
  useEffect(() => {
    // console.log('useEffect: Subscribing to chat updates');
    const chatChannel = supabase
      .channel('public:chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chats' }, handleChatInsert)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chats' }, handleChatUpdate)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'chats' }, handleChatDelete)
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      // console.log('useEffect: Unsubscribing from chat updates');
      chatChannel.unsubscribe();
    };
  }, []);

  const handleChatInsert = async (payload: any) => {
    const newChat = payload.new;
    console.log('handleChatInsert: New chat inserted', newChat);
  
    try {
      // Only update relevant fields like last_message and timestamp, no need to fetch sender details
      const updatedNewChat = { 
        ...newChat, 
        last_message: newChat.last_message,  // Ensure the last message is correctly updated
        timestamp: newChat.timestamp          // Ensure the timestamp is updated
      };
  
      // Update Dexie DB with the new chat
      await db.chats.put(updatedNewChat);
  
      // Update state with the new chat (prepend it to the list to keep it at the top)
      setChats((prevChats) => [updatedNewChat, ...prevChats]);
    } catch (error) {
      console.error('Error inserting new chat:', error);
    }
  };

  let timeout: NodeJS.Timeout;

  const handleChatUpdate = async (payload: any) => {
    const updatedChat = payload.new;
  
    // Clear any previous timeout if a new event comes in
    clearTimeout(timeout);
  
    timeout = setTimeout(async () => {
      try {
        // Update Dexie DB by only updating the last_message field
        await db.chats.update(updatedChat.id, { last_message: updatedChat.last_message, timestamp: updatedChat.timestamp });
  
        // Update state to reflect the last_message change
        setChats((prevChats) => 
          prevChats.map((chat) => 
            chat.id === updatedChat.id ? { ...chat, last_message: updatedChat.last_message, timestamp: updatedChat.timestamp } : chat
          )
        );
      } catch (error) {
        console.error('Error updating chat:', error);
      }
    }, 0); // Adjust the debounce interval (e.g., 300ms)
  };

  // Handle chat delete event (chat deleted)
  const handleChatDelete = (payload: any) => {
    console.log('handleChatDelete: Chat deleted', payload);
    const deletedChatId = payload.old.id;

    // Remove from Dexie DB
    db.chats.delete(deletedChatId).catch((error) => console.error('Error deleting chat:', error));

    setChats((prevChats) => prevChats.filter((chat) => chat.id !== deletedChatId));
  };

  // Subscribe to message updates using Supabase real-time for each chat
  useEffect(() => {
    // console.log('useEffect: Subscribing to message updates');
    if (chats.length === 0) return; // No chats to subscribe to

    const chatChannels = chats.map((chat) => {
      const channel = supabase
        .channel(`public:messages:chat_id=eq.${chat.id}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chat.id}` }, handleNewMessage)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', filter: `chat_id=eq.${chat.id}` }, handleUpdateMessage)
        .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages', filter: `chat_id=eq.${chat.id}` }, handleDeleteMessage)
        // .subscribe();

      return channel;
    });

    // Cleanup message channels when component unmounts
    return () => {
      // console.log('useEffect: Unsubscribing from message updates');
      chatChannels.forEach((channel) => channel.unsubscribe());
    };
  }, [chats]);
  // Handler for new message event
  const handleNewMessage = async (payload: any) => {
    // console.log('handleNewMessage: New message received', payload);
    const newMessage = payload.new;

    try {
      // Insert the new message into Dexie DB
      await db.messages.put(newMessage);
    } catch (error) {
      console.error('Error inserting new message:', error);
    }
  };

  // Handler for updated message event
  const handleUpdateMessage = (payload: any) => {
    console.log('handleUpdateMessage: Message updated', payload);
    const updatedMessage = payload.new;

    // Update the message in Dexie DB
    db.messages.update(updatedMessage.id, updatedMessage).catch((error) => console.error('Error updating message:', error));
  };

  // Handler for deleted message event
  const handleDeleteMessage = (payload: any) => {
    console.log('handleDeleteMessage: Message deleted', payload);
    const deletedMessageId = payload.old.id;

    // Delete the message from Dexie DB
    db.messages.delete(deletedMessageId).catch((error) => console.error('Error deleting message:', error));
  };

  return {
    chats, // Return chats instead of contacts
    loading,
    syncError, // Return sync error if any
    dexieLoading, // Provide Dexie loading state as well
  };
};
