import { Message } from '@/models/message';

// Utility to check if a message has changed based on key properties
export const isMessageChanged = (oldMessage: Message, newMessage: Message): boolean => {
  return oldMessage.content !== newMessage.content || oldMessage.status !== newMessage.status;
};
