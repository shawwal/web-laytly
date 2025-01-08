// components/chat/content-renderer.tsx
import { useState, useEffect } from "react";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import { LibraryView } from "@/components/chat/library-view";
import { AlbumsView } from "@/components/chat/albums-view";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useSendMessage } from "@/hooks/useSendMessage";
import LoadingOverlay from "@/components/loading-overlay";

interface ContentRendererProps {
  activeTab: string;
  userId: string;
  chatId: string;
}

export function ContentRenderer({
  activeTab,
  userId,
  chatId,
}: ContentRendererProps) {
  const { messages, loading, addMessage } = useChatMessages({ chat_id: chatId });
  const { sendMessage } = useSendMessage(chatId, addMessage);
  console.log('message', messages);
  const [isInputFocused, setInputFocused] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      setIsLoadingMessages(false);
    }
  }, [messages, loading]);

  const handleInputFocus = () => setInputFocused(true);
  const handleInputBlur = () => setInputFocused(false);

  if (isLoadingMessages) {
    return <LoadingOverlay />;
  }

  switch (activeTab) {
    case 'chat':
      return (
        <div className="flex flex-col h-full">
          <MessageList messages={messages} currentUserId={userId} onInputFocus={isInputFocused} />
          <div className="p-4 pb-16 md:pb-4 space-y-4">
            <MessageInput
              onSend={sendMessage}
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
