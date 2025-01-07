'use client'

import { useState, useEffect } from 'react'
import { useChat } from '@/contexts/chat-context'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatTabs } from '@/components/chat/chat-tabs'
import { ActiveContact } from '@/components/chat/active-contact'
import { resetUnreadCount } from '@/utils/resetUnreadCount'

export function ChatView({currentUser} : any) {
  const [activeContact, setActiveContact] = useState<any>(null)
  const { activeContactId, activeName, activeAvatar, isMobileMessageView, friendId, setIsMobileMessageView } = useChat()
  // Fetch contact details when activeContactId changes
  const currentChatId = activeContactId || '' as string;
  useEffect(() => {
    if (activeContactId) {
      // Fetch the contact details for the active chat.
      fetchContacts();
    }
  }, [activeContactId]);

  const fetchContacts = async () => {
    // Replace this with actual logic to fetch the contact details, like from Supabase or Dexie
    setActiveContact({
      id: activeContactId,
      friend_id: friendId,
      name: activeName,
      avatar: activeAvatar
    });
  };

  const handleBack = () => {
    setIsMobileMessageView(false)
  }

  useEffect(() => {
    const resetUnread = async () => {
      if(activeContactId && currentUser) {
        await resetUnreadCount({ chatId: activeContactId, userId: currentUser});
      }
    };

    resetUnread();
  }, [activeContactId, currentUser]);


  // Render loading or empty state if no active contact is selected or on small screens
  if (!activeContactId || (!isMobileMessageView && window.innerWidth < 768)) {
    return (
      <div className="hidden md:flex flex-col flex-1 items-center justify-center text-center p-4">
        <p className="text-gray-500 dark:text-gray-400">
          Select a conversation to start messaging
        </p>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex flex-col flex-1 relative z-10",
      !isMobileMessageView && 'hidden md:flex',
      "w-full"
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
        <ChatTabs chatId={activeContactId} />
      </div>
    </div>
  )
}
