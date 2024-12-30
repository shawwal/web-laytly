// /components/ContactList.tsx
'use client'

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChat } from '@/contexts/chat-context';  // For setting active chat
import { useChats } from '@/db/useChats';  // Importing the combined useChats hook
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton'; // Import the Skeleton component from ShadCN UI

export function ContactList() {
  const [activeContactId, setActiveContactId] = useState<string>('');
  const { contacts, loading, syncError } = useChats();  // Using the combined hook
  const { isMobileMessageView, setIsMobileMessageView } = useChat();  // From the chat context

  const handleContactClick = (contactId: string) => {
    setActiveContactId(contactId);
    setIsMobileMessageView(true);
  };

  // Skeleton UI for loading state using ShadCN's Skeleton component
  if (loading) {
    return (
      <div className="flex-1 md:flex-none md:w-80 border-r dark:border-gray-800">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b dark:border-gray-800">
            <h2 className="text-lg font-semibold">Chats</h2>
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

  // Error state
  if (syncError) {
    return <div>Error syncing chats: {syncError}</div>;  // Error state
  }

  return (
    <div className={cn("flex-1 md:flex-none md:w-80 border-r dark:border-gray-800", isMobileMessageView ? 'hidden md:block' : 'block')}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b dark:border-gray-800">
          <h2 className="text-lg font-semibold">Chats</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => handleContactClick(contact.id)}
              className={cn(
                "flex items-center gap-3 p-4 w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                activeContactId === contact.id && "bg-gray-100 dark:bg-gray-800"
              )}
            >
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/` + contact.avatar || '/default-avatar.png'}
                  alt={contact.name}
                  className="object-cover rounded-full w-full h-full"
                />
                <AvatarFallback>{contact.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-sm font-medium truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(contact.lastMessageTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {contact.lastMessage}
                </p>
              </div>
              {contact.unreadCount > 0 && (
                <div className="bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {contact.unreadCount}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
