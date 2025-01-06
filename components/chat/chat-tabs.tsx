// components/chat/chat-tabs.tsx
'use client'

import { useState, useEffect } from "react";
import { TabNavigation } from "@/components/chat/tab-navigation";
import { ContentRenderer } from "@/components/chat/content-renderer";
import useSession from "@/hooks/useSession";

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
  const { session } = useSession();
  const userId = session?.user?.id as string;

  useEffect(() => {
    // console.log("ChatTab Loaded: Active Tab:", activeTab);
  }, [activeTab]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
      <div className="flex-1 overflow-y-auto">
        <ContentRenderer
          activeTab={activeTab}
          userId={userId}
          chatId={chatId}
        />
      </div>
    </div>
  );
}
