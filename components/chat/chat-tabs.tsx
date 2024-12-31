'use client'

import { cn } from "@/lib/utils"
import { useState } from "react"
import { LibraryView } from "./library-view"
import { AlbumsView } from "./albums-view"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"

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
  loading: boolean
  onSend: (content: string, audioBlob?: Blob, images?: File[]) => void
}

export function ChatTabs({ messages, onSend }: ChatTabsProps) {
  const [activeTab, setActiveTab] = useState('chat')

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return (
          <div className="flex flex-col h-full">
            <MessageList messages={messages} />
            <div className="p-4 pb-20 md:pb-4 space-y-4">
              {/* <div className="flex flex-wrap gap-2">
                {["Sure thing!", "Sounds good!", "Take care!", "Absolutely!"].map((reply) => (
                  <button
                    key={reply}
                    onClick={() => onSend(reply)}
                    className="px-4 py-2 text-sm rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    {reply}
                  </button>
                ))}
              </div> */}
              <MessageInput onSend={onSend} />
            </div>
          </div>
        )
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
