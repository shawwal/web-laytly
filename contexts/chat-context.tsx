// contexts/chat-context.tsx
'use client'

import { createContext, useContext, useState } from 'react'

interface ChatContextType {
  activeContactId: string | null
  setActiveContactId: (id: string | null) => void
  activeName: string | null
  setActiveName: (id: string | null) => void
  activeAvatar: string | null
  setActiveAvatar: (name: string | null) => void
  friendId: string | null
  setFriendId: (id: string | null) => void
  isMobileMessageView: boolean
  setIsMobileMessageView: (value: boolean) => void
}

const ChatContext = createContext<ChatContextType>({
  activeContactId: null,
  setActiveContactId: () => {},
  activeName: null,
  setActiveName: () => {},
  activeAvatar: null,
  setActiveAvatar: () => {},
  friendId: null,
  setFriendId: () => {},
  isMobileMessageView: false,
  setIsMobileMessageView: () => {},
})

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [activeContactId, setActiveContactId] = useState<string | null>(null)
  const [activeName, setActiveName] = useState<string | null>(null)
  const [activeAvatar, setActiveAvatar] = useState<string | null>(null)
  const [friendId, setFriendId] = useState<string | null>(null)
  const [isMobileMessageView, setIsMobileMessageView] = useState(false)

  return (
    <ChatContext.Provider 
      value={{ 
        activeContactId, 
        setActiveContactId,
        activeName,
        setActiveName,
        activeAvatar,
        setActiveAvatar,
        friendId,
        setFriendId,
        isMobileMessageView,
        setIsMobileMessageView
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)

