'use client'
// @ts-nocheck

import { useEffect, useState } from 'react'
import { useChatMessages } from '@/hooks/useChatMessages' // Import the custom hook
import { useChat } from '@/contexts/chat-context'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatTabs } from '@/components/chat/chat-tabs'
import { ActiveContact } from '@/components/chat/active-contact'

export function ChatView() {
  const [activeContact, setActiveContact] = useState<any>(null)
  const { activeContactId, activeName, activeAvatar, isMobileMessageView, setIsMobileMessageView } = useChat()

  // Fetch chat messages using the custom hook
  const { messages, loading, fetchChatMessages } = useChatMessages({ chat_id: activeContactId });

  // Fetch contact details when activeContactId changes
  useEffect(() => {
    if (activeContactId) {
      // Here you could use the same logic you used to get the contact from Supabase or Dexie DB
      // For now, we'll just mock the contact fetching
      fetchContacts();
    }
  }, [activeContactId]);

  const fetchContacts = async () => {
    // Replace this with logic to fetch contacts from Supabase or Dexie
    // For now, we'll just simulate a contact for demonstration
    setActiveContact({
      id: activeContactId,
      name: activeName,  // Replace with dynamic data
      avatar: activeAvatar
    });
  };

  const handleSend = async (content: string, audioBlob?: Blob) => {
    if (!activeContactId) {
      console.error("No active contact selected.");
      return;
    }

    const receiverId = activeContactId as string;

    const optimisticMessage = {
      id: Date.now().toString(),
      content,
      senderId: 'me',
      receiverId,
      timestamp: Date.now(),
      status: 'sending' as const,
      audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined
    };

    // Update the UI optimistically
    fetchChatMessages(true); // Fetch older messages (if any)

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

    // Update the message status to sent after the delay
    const sentMessage = { ...optimisticMessage, status: 'sent' as const };

    // You can sync this message with Supabase or Dexie here (if needed)
    // After the message is added, re-fetch or update the state as needed
  };

  const handleBack = () => {
    setIsMobileMessageView(false);
  };

  if (!activeContactId || (!isMobileMessageView && window.innerWidth < 768)) {
    return (
      <div className="hidden md:flex flex-col flex-1 items-center justify-center text-center p-4">
        <p className="text-gray-500 dark:text-gray-400">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col flex-1 relative z-10",
      !isMobileMessageView && 'hidden md:flex'
    )}>
      <div className="border-b dark:border-gray-800 p-4 flex items-center backdrop-blur-xl bg-white/50 dark:bg-gray-900/50">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={handleBack}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        {activeContact && <ActiveContact contact={activeContact} />}
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatTabs messages={messages} loading={loading} onSend={handleSend} />
      </div>
    </div>
  );
}
