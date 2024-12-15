'use client'

import { createContext, useContext, useState } from 'react'

interface ChatContextType {
  activeContactId: string | null
  setActiveContactId: (id: string | null) => void
  isMobileMessageView: boolean
  setIsMobileMessageView: (value: boolean) => void
}

const ChatContext = createContext<ChatContextType>({
  activeContactId: null,
  setActiveContactId: () => {},
  isMobileMessageView: false,
  setIsMobileMessageView: () => {},
})

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [activeContactId, setActiveContactId] = useState<string | null>(null)
  const [isMobileMessageView, setIsMobileMessageView] = useState(false)

  return (
    <ChatContext.Provider 
      value={{ 
        activeContactId, 
        setActiveContactId,
        isMobileMessageView,
        setIsMobileMessageView
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)

