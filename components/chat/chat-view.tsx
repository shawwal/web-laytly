'use client'
// @ts-nocheck

import { useEffect, useState } from 'react'
import { addMessage, getMessages, initDB, getContacts } from '@/lib/db'
import { useChat } from '@/contexts/chat-context'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatTabs } from '@/components/chat/chat-tabs'
import { ActiveContact } from '@/components/chat/active-contact'

export function ChatView() {
  const [messages, setMessages] = useState<any[]>([])
  const [activeContact, setActiveContact] = useState<any>(null)
  const { activeContactId, isMobileMessageView, setIsMobileMessageView } = useChat()

  useEffect(() => {
    if (activeContactId) {
      initDB().then(() => {
        // Fetch messages
        getMessages(activeContactId).then((newMessages) => {
          if (newMessages.length !== messages.length) {
            setMessages(newMessages)
          }
        })

        // Fetch contact
        getContacts().then(contacts => {
          const contact = contacts.find(c => c.id === activeContactId)
          if (contact && contact !== activeContact) {
            setActiveContact(contact)
          }
        })
      })
    }
  }, [activeContactId]) // Only depend on activeContactId to avoid unnecessary re-renders

  const handleSend = async (content: string, audioBlob?: Blob) => {
    if (!activeContactId) {
      console.error("No active contact selected.")
      return
    }

    const receiverId = activeContactId as string

    const optimisticMessage = {
      id: Date.now().toString(),
      content,
      senderId: 'me',
      receiverId,
      timestamp: Date.now(),
      status: 'sending' as const,
      audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined
    }

    setMessages((prev) => [...prev, optimisticMessage])

    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

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
        <ChatTabs messages={messages} onSend={handleSend} />
      </div>
    </div>
  )
}
