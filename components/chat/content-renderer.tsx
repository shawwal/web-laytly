// components/chat/content-renderer.tsx
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import { LibraryView } from "@/components/chat/library-view";
import { AlbumsView } from "@/components/chat/albums-view";
import LoadingOverlay from "@/components/loading-overlay";
import { Message } from "@/models/message";

interface ContentRendererProps {
  activeTab: string;
  messages: Message[];
  userId: string;
  isLoadingMessages: boolean;
  sendMessage:  any;
  isInputFocused: boolean;
  handleInputFocus: () => void;
  handleInputBlur:  () => void;
}

export function ContentRenderer({
  activeTab,
  messages,
  userId,
  isLoadingMessages,
  sendMessage,
  isInputFocused,
  handleInputFocus,
  handleInputBlur,
}: ContentRendererProps) {
  if (isLoadingMessages) {
    return <LoadingOverlay />;
  }

  switch (activeTab) {
    case 'chat':
      return (
        <div className="flex flex-col h-full">
          <MessageList messages={messages} currentUserId={userId} onInputFocus={isInputFocused} />
          <div className="p-4 pb-16 md:pb-4 space-y-4">
            <MessageInput onSend={sendMessage} onFocus={handleInputFocus} onBlur={handleInputBlur} />
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
