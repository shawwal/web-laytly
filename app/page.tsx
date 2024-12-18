import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { ContactList } from '@/components/chat/contact-list'
import { ChatView } from '@/components/chat/chat-view'
import { ChatProvider } from '@/contexts/chat-context'
import { getSupabaseToken } from '@/utils/tokenUtils' // Import the async token check function

export const metadata: Metadata = {
  title: 'Laytly App',
  description: 'Sharing your life lately',
}

export default async function Page() {
  // Check if the user is authenticated by verifying the Supabase token
  const token = await getSupabaseToken() // Await the token check

  // If no token is found, redirect to the login page
  if (!token) {
    redirect('/auth/login')
  }

  // If token exists, render the page content
  return (
    <ChatProvider>
      <div className="flex h-full bg-white dark:bg-gray-900">
        <ContactList />
        <ChatView />
      </div>
    </ChatProvider>
  )
}
