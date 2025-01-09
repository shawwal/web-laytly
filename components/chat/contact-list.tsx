'use client'

import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChat } from '@/contexts/chat-context';  // For setting active chat
import { useChats } from '@/db/useChats';  // Importing the combined useChats hook
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton'; // Import the Skeleton component from ShadCN UI
import { formatDistanceToNow } from 'date-fns';
import { checkMediaMessage } from '@/utils/messageUtils';

export function ContactList() {
  const {
    activeContactId,
    setActiveContactId,
    setActiveAvatar,
    setActiveName,
    setFriendId,
    setIsGroup,
    isMobileMessageView,
    setIsMobileMessageView
  } = useChat();  // From the chat context

  const { chats, loading } = useChats();  // Using the combined hook
  const handleContactClick = (contactId: string, name: string, avatar: string, friendId: string, isGroup: boolean) => {
    setActiveContactId(contactId);  // Update global activeContactId from context
    setActiveName(name);
    setActiveAvatar(avatar);
    setFriendId(friendId);
    setIsGroup(isGroup);
    setIsMobileMessageView(true);  // Set mobile message view state
  };

  // Sorting chats by the latest `lastMessageTime` (descending order)
  const sortedChats = useMemo(() => {
    return chats
      .slice() // Create a shallow copy to avoid mutating the original array
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [chats]);
  // Skeleton UI for loading state using ShadCN's Skeleton component
  if (loading) {
    return (
      <div className="flex-1 md:flex-none md:w-80 border-r dark:border-gray-800">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b dark:border-gray-800">
            <h2 className="text-lg font-semibold">Retrieving Messages ...</h2>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4">
            {/* Skeleton Loader */}
            {[...Array(13)].map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-4 w-full rounded-md">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-baseline">
                    <Skeleton className="w-24 h-4 rounded" />
                    <Skeleton className="w-12 h-4 rounded" />
                  </div>
                  <Skeleton className="w-32 h-4 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex-1 md:flex-none md:w-80 border-r dark:border-gray-800",
        isMobileMessageView ? 'hidden md:block' : 'block',
        "overflow-hidden" // Added bottom padding for mobile view to avoid navigation bar overlap
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b dark:border-gray-800">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 pb-16 sm:pb-0">
          {sortedChats.map((chat) => {
            const  lastMessageTime = chat.timestamp ? new Date(chat.timestamp).getTime() : 0;
            return (
              <button
                key={chat.id}
                onClick={() => handleContactClick(chat.id, chat.name, chat.avatar_url, chat.friend_id, chat.is_group)}  // Set active contact on click
                className={cn(
                  "flex items-center gap-3 p-4 w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                  activeContactId === chat.id && "bg-gray-100 dark:bg-gray-800"
                )}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/` + chat.avatar_url || '/default-avatar.png'}
                    alt={chat.name}
                    className="object-cover rounded-full w-full h-full"
                  />
                  <AvatarFallback>{chat.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-baseline gap-2">
                    <h3 className="text-sm font-medium truncate" style={{ maxWidth: 'calc(100% - 50px)' }}>{chat.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatDistanceToNow(new Date(lastMessageTime), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-full">
                    {checkMediaMessage(chat.last_message)}
                  </p>
                </div>
                {chat.unread_count > 0 && (
                  <div className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unread_count}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
