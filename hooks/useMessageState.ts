// hooks/useMessageState.ts
import { useState } from 'react';
import { Message } from '@/models/message';

export function useMessageState() {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages(prevMessages => {
      if (prevMessages.some(existingMsg => existingMsg.id === message.id)) {
        return prevMessages;
      }
      return [message, ...prevMessages]; // Add the new message
    });
  };

  const removeMessage = (messageId: string) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
  };

  const setMessageList = (newMessages: Message[]) => {
    setMessages(newMessages);
  };

  return {
    messages,
    addMessage,
    removeMessage,
    setMessageList,
  };
}
