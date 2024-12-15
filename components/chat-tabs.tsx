'use client'

import { cn } from "@/lib/utils"
import { useState } from "react"
import { LibraryView } from "./library-view"
import { AlbumsView } from "./albums-view"
import { MessageList } from "./message-list"

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
  messages: any[]
}

export function ChatTabs({ messages }: ChatTabsProps) {
  const [activeTab, setActiveTab] = useState('chat')

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <MessageList messages={messages} />
      case 'library':
        return <LibraryView />
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

