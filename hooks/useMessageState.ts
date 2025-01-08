import { useState } from 'react';
import { Message } from '@/models/message';

export function useMessageState() {
  const [messages, setMessages] = useState<Message[]>([]);

  // Add a new message, ensuring it doesn't already exist
  const addMessage = (message: Message) => {
    setMessages(prevMessages => {
      // Check if the message already exists in the state
      if (prevMessages.some(existingMsg => existingMsg.id === message.id)) {
        return prevMessages; // Do not add the message again if it exists
      }
      // Add the message at the beginning of the list (or at any position you prefer)
      return [message, ...prevMessages]; // Create a new array with the new message
    });
  };

  // Edit an existing message by ID
  const editMessage = (updatedMessage: Message) => {
    setMessages(prevMessages => {
      return prevMessages.map(msg =>
        msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg
      );
    });
  };

  // Remove a message by ID
  const removeMessage = (messageId: string) => {
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
  };

  // Set the entire message list (for initializing or resetting state)
  const setMessageList = (newMessages: Message[]) => {
    setMessages(newMessages);
  };

  return {
    messages,
    addMessage,
    editMessage,
    removeMessage,
    setMessageList,
  };
}
