'use client'

import { useEffect, useState } from 'react'
import { MessageInput } from './message-input'
import { addMessage, getMessages, initDB, getContacts } from '@/lib/db'
import { useChat } from '@/contexts/chat-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatTabs } from './chat-tabs'

const quickReplies = [
  "Sure thing!",
  "Sounds good!",
  "Take care!",
  "Absolutely!"
]

export function ChatView() {
  const [messages, setMessages] = useState<any[]>([])
  const [activeContact, setActiveContact] = useState<any>(null)
  const { 
    activeContactId, 
    setActiveContactId,
    isMobileMessageView,
    setIsMobileMessageView
  } = useChat()

  useEffect(() => {
    if (activeContactId) {
      initDB().then(() => {
        getMessages(activeContactId).then(setMessages)
        getContacts().then(contacts => {
          const contact = contacts.find(c => c.id === activeContactId)
          setActiveContact(contact)
        })
      })
    }
  }, [activeContactId])

  const handleSend = async (content: string) => {
    // Ensure activeContactId is not null
    if (!activeContactId) {
      return; // Prevent sending message if there's no valid activeContactId
    }

    const optimisticMessage = {
      id: Date.now().toString(),
      content,
      senderId: 'me',
      receiverId: activeContactId, // Now guaranteed to be a string
      timestamp: Date.now(),
      status: 'sending' as const,
    }

    setMessages((prev) => [...prev, optimisticMessage])

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const sentMessage = { ...optimisticMessage, status: 'sent' as const }
    await addMessage(sentMessage)
    
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === optimisticMessage.id ? sentMessage : msg
      )
    )
  }

  const handleBack = () => {
    setIsMobileMessageView(false)
  }

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
      "flex flex-col flex-1",
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
        {activeContact && (
          <>
            <Avatar className="h-10 w-10">
              <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
              <AvatarFallback>{activeContact.name[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">{activeContact.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
            </div>
          </>
        )}
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        <ChatTabs messages={messages} />
      </div>
      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => handleSend(reply)}
              className="px-4 py-2 text-sm rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {reply}
            </button>
          ))}
        </div>
        <MessageInput onSend={handleSend} />
      </div>
    </div>
  )
}
