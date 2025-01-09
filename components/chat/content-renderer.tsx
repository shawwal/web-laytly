// components/chat/content-renderer.tsx
import { useState } from "react";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import { LibraryView } from "@/components/chat/library-view";
import { AlbumsView } from "@/components/chat/albums-view";
import useChatMessages from "@/hooks/chat/useChatMessages";
import LoadingOverlay from "@/components/loading-overlay";
import useChatInitialization from "@/hooks/useChatInitialization";
import useSenderDetails from "@/hooks/useSenderDetails";
// import { processMessagesWithDates } from '@/utils/messageProcessing';

interface ContentRendererProps {
  activeTab: string;
  userId: string;
  chatId: string | any;
  listUserOnline: string[];
}

export function ContentRenderer({
  activeTab,
  userId,
  chatId,
  listUserOnline,
}: ContentRendererProps) {
  const [loading, setLoading] = useState(false);
  // const { fetchChatMessages } = useChatMessages(chatId);
  const { fetchSenderDetails } = useSenderDetails(); 
  const [chatMessages, setChatMessages] = useState([]);
  // console.log('userId', userId)
  // console.log('chatId', chatId)
  const { fetchChatMessages, handleSendMessage } = useChatMessages(chatId, userId, listUserOnline);

  useChatInitialization(chatId, setLoading, fetchChatMessages, fetchSenderDetails, setChatMessages);

  // const { messages, loading, addMessage } = useChatMessages({ chat_id: chatId });

  // const processedMessages = useMemo(() => {
  //   const messages = chatMessages[chatId] || [];
  //   return processMessagesWithDates([...messages].reverse());
  // }, [chatMessages, chatId]);
  // console.log('processedMessages', processedMessages)

  const messages = chatMessages[chatId] || [];
  
  const [isInputFocused, setInputFocused] = useState(false);
  // const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  // useEffect(() => {
  //   if (!loading && messages.length > 0) {
  //     setIsLoadingMessages(false);
  //   }
  // }, [messages, loading]);

  const handleInputFocus = () => setInputFocused(true);
  const handleInputBlur = () => setInputFocused(false);

  if (loading) {
    return <LoadingOverlay />;
  }

  switch (activeTab) {
    case 'chat':
      return (
        <div className="flex flex-col h-full">
          <MessageList messages={messages} currentUserId={userId} onInputFocus={isInputFocused} />
          <div className="p-4 pb-16 md:pb-4 space-y-4">
            <MessageInput
              onSend={handleSendMessage}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
            />
          </div>
        </div>
      );
    case 'library':
      return <LibraryView currentUserId={userId} />;
    case 'albums':
      return <AlbumsView />;
    default:
      return <div>No content available for this tab</div>;
  }
}
