'use client'

import { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { LibraryView } from "./library-view"
import { AlbumsView } from "./albums-view"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"
import useSession from "@/hooks/useSession"
import LoadingOverlay from "@/components/loading-overlay"
import { useChatMessages } from '@/hooks/useChatMessages'

interface Tab {
  id: string
  label: string
}

const tabs: Tab[] = [
  { id: 'chat', label: 'Chat' },
  { id: 'library', label: 'Library' },
  { id: 'albums', label: 'Albums' },
]

interface ChatTabsProps {
  chatId: string
}

export function ChatTabs({ chatId }: ChatTabsProps) {
  const [activeTab, setActiveTab] = useState('chat')
  const { session, isLoading } = useSession() as any
  const [isInputFocused, setInputFocused] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)  // Loading state for fetching messages
  const userId = session?.user?.id
  
  // Chat Messages Logic
  const { messages, loading, fetchChatMessages, addMessage, removeMessage } = useChatMessages({ chat_id: chatId })
  
  // Log messages only when they change
  useEffect(() => {
    if (messages.length > 0) {
      console.log('messages', messages);
    }
  }, [messages]);

  const handleInputFocus = () => setInputFocused(true)
  const handleInputBlur = () => setInputFocused(false)

  // Send message logic (Optimistic UI)
  const sendMessage = useCallback(
    async (content: string, audioBlob?: Blob, images?: File[]) => {
      if (!chatId) return;

      const optimisticMessage = {
        id: Date.now().toString(),
        content,
        senderId: 'me',
        receiverId: chatId,
        timestamp: Date.now(),
        status: 'sending' as const,
        audioUrl: audioBlob ? URL.createObjectURL(audioBlob) : undefined,
        images: images || [],
      }

      // Optimistically add the message
      addMessage(optimisticMessage)

      // Simulate network delay (e.g., for actual message sending)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // After sending, update the message status to 'sent'
      const sentMessage = { ...optimisticMessage, status: 'sent' as const }
      addMessage(sentMessage) // Update the message state
    },
    [chatId, addMessage]
  )

  // Reset the loading state when messages are fetched
  useEffect(() => {
    if (!loading && messages.length > 0) {
      setIsLoadingMessages(false)  // Set loading to false once messages are fetched
    }
  }, [messages, loading])

  // Render content for the selected tab
  const renderContent = () => {
    if (isLoading || isLoadingMessages) {
      return <LoadingOverlay /> // Show loading state if session or messages are still loading
    }
    switch (activeTab) {
      case 'chat':
        return (
          <div className="flex flex-col h-full">
            {session?.user?.id && chatId && !loading ? (
              <MessageList messages={messages} currentUserId={userId} onInputFocus={isInputFocused} />
            ) : (
              null
            )}
            <div className="p-4 pb-16 md:pb-4 space-y-4">
              {session?.user?.id && chatId && !loading && (
                <MessageInput onSend={sendMessage} onFocus={handleInputFocus} onBlur={handleInputBlur} />
              )}
            </div>
          </div>
        )
      case 'library':
        return <LibraryView currentUserId={userId} />
      case 'albums':
        return <AlbumsView />
      default:
        return null
    }
  }

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
  )
}
