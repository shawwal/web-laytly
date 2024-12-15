import { Metadata } from 'next'
import { ContactList } from '@/components/chat/contact-list'

export const metadata: Metadata = {
  title: 'Contacts | Chat App',
  description: 'View and manage your contacts',
}

export default function ContactsPage() {
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="border-b dark:border-gray-800 p-4 backdrop-blur-xl bg-white/50 dark:bg-gray-900/50">
        <h1 className="text-2xl font-bold">Contacts</h1>
      </div>
      <div className="flex-1 overflow-auto">
        <ContactList />
      </div>
    </div>
  )
}

