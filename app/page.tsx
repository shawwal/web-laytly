'use client';

import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { ContactList } from '@/components/chat/contact-list';
import { ChatView } from '@/components/chat/chat-view';
import { ChatProvider } from '@/contexts/chat-context';
import useSession from '@/hooks/useSession'; // Import the custom hook
import LoadingOverlay from '@/components/loading-overlay';

export default function Page() {
  const { session, loading } = useSession(); // Use the custom session hook
  const [isRedirecting, setIsRedirecting] = useState(false); // To prevent multiple redirects
  const [mounted, setMounted] = useState(false); // Track mounting status
  const userId = session?.user?.id as string;
  useEffect(() => {
    setMounted(true); // After first mount, we can perform client-specific logic
  }, []);

  useEffect(() => {
    if (!loading && !session && mounted) {
      // Only perform the redirect on the client side after hydration
      setIsRedirecting(true);
      redirect('/auth/login');
    }
  }, [loading, session, mounted]);

  // While session is loading or redirecting, show loading message
  if (loading || isRedirecting || !mounted) {
    return <LoadingOverlay />;
  }

  // If session exists, render the page content
  return (
    <ChatProvider>
      <div className="flex h-full bg-white dark:bg-gray-900">
        <ContactList />
        <ChatView currentUser={userId} />
      </div>
    </ChatProvider>
  );
}
