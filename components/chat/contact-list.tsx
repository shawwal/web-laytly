'use client'

import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getContacts, initDB } from '@/lib/db'
import { useChat } from '@/contexts/chat-context'
import { cn } from '@/lib/utils'

interface Contact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: number
  unreadCount: number
}

export function ContactList() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const { 
    activeContactId, 
    setActiveContactId, 
    isMobileMessageView, 
    setIsMobileMessageView 
  } = useChat()

  useEffect(() => {
    initDB().then(() => {
      getContacts().then(setContacts)
    })
  }, [])

  const handleContactClick = (contactId: string) => {
    setActiveContactId(contactId)
    setIsMobileMessageView(true)
  }

  return (
    <div className={cn(
      "flex-1 md:flex-none md:w-80 border-r dark:border-gray-800",
      isMobileMessageView ? 'hidden md:block' : 'block'
    )}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b dark:border-gray-800">
          <h2 className="text-lg font-semibold">Messages</h2>
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
              <Avatar>
                <AvatarImage src={contact.avatar} />
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
  )
}

