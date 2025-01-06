// src/services/chat/chatService.ts

import { supabase } from '@/lib/supabase';

// Subscribe to real-time updates for messages
export const subscribeToMessages = (chatId: string) => {
  const channel = supabase
    .channel(`messages:${chatId}`)
    .on('system', { schema: 'public', table: 'messages' }, (payload) => {
      console.log('New message:', payload);
      // Update your UI or local state with the new message
    })
    .subscribe();

  return channel;
};
