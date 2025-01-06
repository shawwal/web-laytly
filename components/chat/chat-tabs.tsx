// components/chat/chat-tabs.tsx
'use client'
import { useState, useEffect } from "react";
import { TabNavigation } from "@/components/chat/tab-navigation";
import { ContentRenderer } from "@/components/chat/content-renderer";
import useSession from "@/hooks/useSession";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useChatState } from "@/hooks/useChatState";

const tabs = [
  { id: 'chat', label: 'Chat' },
  { id: 'library', label: 'Library' },
  { id: 'albums', label: 'Albums' },
];

interface ChatTabsProps {
  chatId: string;
}

export function ChatTabs({ chatId }: ChatTabsProps) {
  const [activeTab, setActiveTab] = useState('chat');
  // 
  const { session } = useSession();
  const userId = session?.user?.id as string;
  const { messages, loading, addMessage } = useChatMessages({ chat_id: chatId });
  const { sendMessage } = useSendMessage(chatId, addMessage);
  const { isInputFocused, isLoadingMessages, handleInputFocus, handleInputBlur } = useChatState(chatId, messages, loading);

  useEffect(() => {
    // console.log("ChatTab Loaded: Active Tab:", activeTab, "Messages Loaded:", messages.length);
  }, [activeTab, messages]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <div className="flex-1 overflow-y-auto">
        <ContentRenderer
          activeTab={activeTab}
          messages={messages}
          userId={userId}
          isLoadingMessages={isLoadingMessages}
          sendMessage={sendMessage}
          isInputFocused={isInputFocused}
          handleInputFocus={handleInputFocus}
          handleInputBlur={handleInputBlur}
        />
      </div>
    </div>
  );
}
