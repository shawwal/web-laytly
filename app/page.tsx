import { Metadata } from 'next'
import { ContactList } from '@/components/chat/contact-list'
import { ChatView } from '@/components/chat/chat-view'
import { ChatProvider } from '@/contexts/chat-context'

export const metadata: Metadata = {
  title: 'Chat App',
  description: 'A modern chat application',
}

export default function Page() {
  return (
    <ChatProvider>
      <div className="flex h-full bg-white dark:bg-gray-900">
        <ContactList />
        <ChatView />
      </div>
    </ChatProvider>
  )
}

