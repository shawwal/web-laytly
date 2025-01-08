'use client';

import { useState, useEffect } from 'react';
import { useChat } from '@/contexts/chat-context';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatTabs } from '@/components/chat/chat-tabs';
import { ActiveContact } from '@/components/chat/active-contact';
import { resetUnreadCount } from '@/utils/resetUnreadCount';
import useRoomPresence from '@/hooks/useRoomPresence'; // Import the correct hook

interface chatViewProps {
  currentUser: string
}

export function ChatView({ currentUser }: chatViewProps) {
  const userId = currentUser;
  const [activeContact, setActiveContact] = useState<any>(null);
  const { activeContactId, isGroup, activeName, activeAvatar, isMobileMessageView, friendId, setIsMobileMessageView } = useChat();

  useEffect(() => {
    if (activeContactId) {
      fetchContacts();
    }
  }, [activeContactId]);

  const fetchContacts = async () => {
    setActiveContact({
      id: activeContactId,
      friend_id: friendId,
      name: activeName,
      avatar: activeAvatar,
    });
  };

  const handleBack = () => {
    setIsMobileMessageView(false);
  };

  useEffect(() => {
    const resetUnread = async () => {
      if (activeContactId) { // Use user from useUser
        await resetUnreadCount({ chatId: activeContactId, userId: userId });
      }
    };

    resetUnread();
  }, [activeContactId, userId]); // Add user to dependency array

  const { presences, error } = useRoomPresence(
    `public:messages${activeContactId}`,
    userId || ''
  );

  if (!activeContactId || (!isMobileMessageView && window.innerWidth < 768)) {
    return (
      <div className="hidden md:flex flex-col flex-1 items-center justify-center text-center p-4">
        <p className="text-gray-500 dark:text-gray-400">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className={cn(
        'flex flex-col flex-1 relative z-10',
        !isMobileMessageView && 'hidden md:flex',
        'w-full'
      )}
    >
      <div className="border-b dark:border-gray-800 p-4 flex items-center backdrop-blur-xl bg-white/50 dark:bg-gray-900/50">
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={handleBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        {activeContact && <ActiveContact contact={activeContact} />}
        {/* Display presence information */}
        <div className="ml-4">
          {!isGroup && presences.map((presence) => (
            <span key={presence.userId} className="inline-flex items-center mr-2">
              {presence.userId === userId ?
                null :
                <>
                  <span className={`w-2 h-2 rounded-full mr-1 ${presence.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span> online</span>
                </>
              }

              {/* <span className={`w-2 h-2 rounded-full mr-1 ${presence.online ? 'bg-green-500' : 'bg-gray-400'}`} /> */}
              {/* {presence.userId === userId ? "You" : presence.userId} */}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatTabs chatId={activeContactId} />
      </div>
    </div>
  );
}