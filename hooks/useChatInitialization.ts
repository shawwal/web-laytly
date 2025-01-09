import { useEffect } from 'react';
import { supabase } from "@/lib/supabase";
import { createChatFolder } from '@/utils/folderActions';

const useChatInitialization = (chatId: any, setLoading: any, fetchChatMessages: any, fetchSenderDetails: any, setChatMessages: any) => {
  useEffect(() => {
    const loadMessages = async () => {
      // console.log('Loading messages for chatId:', chatId);
      setLoading(true);

      const messages = await fetchChatMessages();
      // console.log('Fetched messages:', messages);

      // Check if messages are not empty before proceeding
      if (messages.length > 0) {
        // console.log('Messages are not empty, proceeding to fetch sender data.');

        const messagesWithSenderInfo = await Promise.all(
          messages.map(async (msg: any) => {
            // console.log(`Fetching sender details for sender_id: ${msg.sender_id}`);
            const senderData = await fetchSenderDetails(msg.sender_id);
            return { ...msg, sender: senderData };
          })
        );

        // console.log('Messages with sender info:', messagesWithSenderInfo);

        setChatMessages((prevState: any) => ({
          ...prevState,
          [chatId]: messagesWithSenderInfo,
        }));
        // console.log('Chat messages updated in state.');
      } else {
        // console.log('No messages to load.');
      }

      setLoading(false);
      // console.log('Loading complete.');
    };

    loadMessages();

    const handleNewMessage = async (payload: any) => {
      // console.log('Handling new message payload:', payload);
      const senderData = await fetchSenderDetails(payload.new.sender_id);
      // console.log(`Fetched sender details for new message:`, senderData);

      const newMessage = { ...payload.new, sender: senderData };
      // console.log('New message after adding sender details:', newMessage);

      setChatMessages((prevState: any) => {
        const updatedMessages = [...(prevState[chatId] || []), newMessage];
        const uniqueMessages = updatedMessages.filter((msg, index, self) =>
          index === self.findIndex((m) => m.id === msg.id)
        );
        // console.log('Unique messages after adding new message:', uniqueMessages);
        return { ...prevState, [chatId]: uniqueMessages };
      });
      // scrollToBottom();
    };

    const handleDeleteMessage = async (payload: any) => {
      console.log('Handling delete message payload:', payload);
      setChatMessages((prevState: any) => {
        const updatedMessages = (prevState[chatId] || []).filter((msg: any) => msg.id !== payload.old.id);
        console.log('Updated messages after deletion:', updatedMessages);
        return { ...prevState, [chatId]: updatedMessages };
      });
    };

    const handleUpdateMessage = async (payload: any) => {
      console.log('Handling update message payload in message:', payload);
      const updatedMessage = payload.new;
      const senderData = await fetchSenderDetails(updatedMessage.sender_id);
      // console.log(`Fetched sender details for updated message:`, senderData);

      setChatMessages((prevState: any) => {
        const updatedMessages = (prevState[chatId] || []).map((msg: any) =>
          msg.id === updatedMessage.id ? { ...updatedMessage, sender: senderData } : msg
        );
        // console.log('Updated messages after update:', updatedMessages);
        return { ...prevState, [chatId]: updatedMessages };
      });
    };

    const messagesChannel = supabase
      .channel(`public:messages:chat_id=eq.${chatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, handleNewMessage)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, handleDeleteMessage)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, handleUpdateMessage)
      .subscribe();

      // console.log('Supabase channel subscribed for chatId:', chatId);

    return () => {
      // console.log('Removing Supabase channel for chatId:', chatId);
      supabase.removeChannel(messagesChannel);
    };
  }, [chatId]);

  useEffect(() => {
    const ensureFolderExists = async () => {
      // console.log('Ensuring folder exists for chatId:', chatId);
      const folderCreated = await createChatFolder(chatId);
      if (!folderCreated) {
        // console.error('Failed to create folder for chatId:', chatId);
      } else {
        // console.log('Folder successfully created for chatId:', chatId);
      }
    };

    ensureFolderExists();
  }, [chatId]);
};

export default useChatInitialization;
