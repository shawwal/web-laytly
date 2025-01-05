// ChatTabs Component
'use client'

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { LibraryView } from "./library-view";
import { AlbumsView } from "./albums-view";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import useSession from "@/hooks/useSession";
import LoadingOverlay from "@/components/loading-overlay";
import { useChatMessages } from '@/hooks/useChatMessages';
import { v4 as uuidv4 } from 'uuid';
import { useProfile } from "@/hooks/useProfile";

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
  const { session, isLoading } = useSession() as any;
  const [isInputFocused, setInputFocused] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const userId = session?.user?.id;
  const { currentProfile } = useProfile();

  const { messages, loading, addMessage } = useChatMessages({ chat_id: chatId });

  const handleInputFocus = () => setInputFocused(true);
  const handleInputBlur = () => setInputFocused(false);

  const sendMessage = useCallback(
    async (content: string, audioBlob?: Blob, images?: File[]) => {
      if (!chatId || isSending) {
        console.log('Message send skipped, isSending:', isSending);  // Log when skipping send
        return; // Prevent sending if already in progress
      }
  
      setIsSending(true); // Set sending state to true
      console.log('Sending message:', content); // Log the message being sent
  
      const optimisticMessage = {
        id: uuidv4(),  // Use UUID for a unique message ID
        content,
        sender_id: currentProfile?.id,  // Use session user ID as sender
        timestamp: new Date().toISOString(),  // Use ISO string for timestamp
        status: 'sending' as const, // Only set to sending
        is_forwarded: false,  // Set to false by default
        original_message_id: null,  // No original message when sending new one
        reply_to: null,  // No reply for optimistic message
        reply_to_id: null,  // No reply ID
        sender: {
          id: currentProfile?.id,  // Use session user ID
          username: currentProfile?.username || 'Unknown',
          email: currentProfile?.email || 'unknown@example.com',
          avatar_url: currentProfile?.avatar_url || 'default-avatar.jpg',
        },
      }
  
      console.log('Optimistically adding message:', optimisticMessage); // Log the optimistic message
  
      // Optimistically add the message (no duplicate check for "sending" status)
      addMessage(optimisticMessage);
  
      try {
        // Simulate network delay (e.g., for actual message sending)
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        // After sending, update the message status to 'sent' in the backend (handled elsewhere)
        console.log('Message sent, updating status in the backend');
        // Here, you should update the message status to 'sent' in your backend/database
        // The frontend will update its state when the backend confirms the message as "sent"
        
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsSending(false); // Reset sending state
      }
    },
    [chatId, addMessage, isSending, currentProfile?.id] // Ensure it uses the current user profile
  );
  

  useEffect(() => {
    if (!loading && messages.length > 0) {
      setIsLoadingMessages(false);
    }
  }, [messages, loading]);

  const renderContent = () => {
    if (isLoading || isLoadingMessages) {
      return <LoadingOverlay />;
    }
    switch (activeTab) {
      case 'chat':
        return (
          <div className="flex flex-col h-full">
            {session?.user?.id && chatId && !loading ? (
              <MessageList messages={messages} currentUserId={userId} onInputFocus={isInputFocused} />
            ) : null}
            <div className="p-4 pb-16 md:pb-4 space-y-4">
              {session?.user?.id && chatId && !loading && (
                <MessageInput onSend={sendMessage} onFocus={handleInputFocus} onBlur={handleInputBlur} />
              )}
            </div>
          </div>
        );
      case 'library':
        return <LibraryView currentUserId={userId} />;
      case 'albums':
        return <AlbumsView />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex border-b dark:border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-4 px-6 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
              activeTab === tab.id && "text-blue-500 dark:text-blue-400 border-b-2 border-blue-500"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}
