// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabase';
// import db from '@/db/dexie-db'; // Import Dexie DB
// import { createChatFolder } from '@/utils/folderActions';
// import { insertMessageToDexie } from '@/utils/supabase/chat';
// import { syncMessagesWithSupabase } from '@/utils/syncUtils';

// const useChatInitialization = (params: any, setLoading: any, fetchChatMessages: any, fetchSenderDetails: any, setChatMessages: any, scrollToBottom: any) => {
//   const [isOffline, setIsOffline] = useState(false); // Track offline status

//   // Check if the user is online or offline
//   useEffect(() => {
//     const handleOnline = () => {
//       setIsOffline(false);
//       syncMessagesWithSupabase(); // Sync data to Supabase when the device goes online
//     };
    
//     const handleOffline = () => {
//       setIsOffline(true);
//     };

//     window.addEventListener('online', handleOnline);
//     window.addEventListener('offline', handleOffline);

//     return () => {
//       window.removeEventListener('online', handleOnline);
//       window.removeEventListener('offline', handleOffline);
//     };
//   }, []);

//   // Load messages from either Supabase or DexieDB based on online/offline status
//   useEffect(() => {
//     const loadMessages = async () => {
//       setLoading(true);
//       let messages = [];

//       if (isOffline) {
//         // Load from DexieDB when offline
//         messages = await db.messages.toArray();
//       } else {
//         // Load from Supabase when online
//         messages = await fetchChatMessages();
//       }

//       // Fetch sender info
//       const messagesWithSenderInfo = await Promise.all(
//         messages.map(async (msg: any) => {
//           const senderData = await fetchSenderDetails(msg.sender_id);
//           return { ...msg, sender: senderData };
//         })
//       );

//       setChatMessages((prevState: any) => ({
//         ...prevState,
//         [params.chat_id]: messagesWithSenderInfo,
//       }));

//       setLoading(false);
//     };

//     loadMessages();
//   }, [params.chat_id, setChatMessages, fetchChatMessages, fetchSenderDetails, isOffline, setLoading]);

//   // Sync messages with Supabase when new messages are added locally (e.g., during offline mode)
//   useEffect(() => {
//     const channel = supabase
//       .channel(`public:messages:chat_id=eq.${params.chat_id}`)
//       .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${params.chat_id}` }, handleNewMessage)
//       .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages', filter: `chat_id=eq.${params.chat_id}` }, handleDeleteMessage)
//       .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', filter: `chat_id=eq.${params.chat_id}` }, handleUpdateMessage)
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [params.chat_id]);

//   // Handle new message
//   const handleNewMessage = async (payload: any) => {
//     const senderData = await fetchSenderDetails(payload.new.sender_id);
//     const newMessage = { ...payload.new, sender: senderData };

//     if (isOffline) {
//       // Insert message into DexieDB if offline
//       await insertMessageToDexie(newMessage);
//     } else {
//       setChatMessages((prevState: any) => {
//         const updatedMessages = [...(prevState[params.chat_id] || []), newMessage];
//         const uniqueMessages = updatedMessages.filter((msg, index, self) =>
//           index === self.findIndex((m) => m.id === msg.id)
//         );
//         return { ...prevState, [params.chat_id]: uniqueMessages };
//       });
//     }

//     scrollToBottom();
//   };

//   const handleDeleteMessage = async (payload: any) => {
//     setChatMessages((prevState: any) => {
//       const updatedMessages = (prevState[params.chat_id] || []).filter(msg => msg.id !== payload.old.id);
//       return { ...prevState, [params.chat_id]: updatedMessages };
//     });

//     if (isOffline) {
//       // Handle message deletion in DexieDB if offline
//       await db.messages.delete(payload.old.id);
//     }
//   };

//   const handleUpdateMessage = async (payload: any) => {
//     const updatedMessage = payload.new;
//     const senderData = await fetchSenderDetails(updatedMessage.sender_id);

//     setChatMessages((prevState: any) => {
//       const updatedMessages = (prevState[params.chat_id] || []).map(msg =>
//         msg.id === updatedMessage.id ? { ...updatedMessage, sender: senderData } : msg
//       );
//       return { ...prevState, [params.chat_id]: updatedMessages };
//     });

//     if (isOffline) {
//       // Update the message in DexieDB if offline
//       await db.messages.put(updatedMessage);
//     }
//   };

//   // Ensure folder exists in DexieDB
//   useEffect(() => {
//     const ensureFolderExists = async () => {
//       const folderCreated = await createChatFolder(params.chat_id);
//       if (!folderCreated) {
//         console.error('Failed to create folder for chat');
//       }
//     };

//     ensureFolderExists();
//   }, [params.chat_id]);

//   return { isOffline };
// };

// export default useChatInitialization;
