// hooks/useChatState.ts
import { Message } from '@/models/message';
import { useState, useEffect } from 'react';

export function useChatState(chatId: string, messages: Message[], loading: boolean) {
  const [isInputFocused, setInputFocused] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      setIsLoadingMessages(false);
    }
  }, [messages, loading]);

  const handleInputFocus = () => setInputFocused(true);
  const handleInputBlur = () => setInputFocused(false);

  return {
    isInputFocused,
    isLoadingMessages,
    handleInputFocus,
    handleInputBlur,
  };
}
