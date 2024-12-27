'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component
import useSession from '@/hooks/useSessions'; // Your useSession hook
import Link from 'next/link';
import LoadingOverlay from '@/components/loading-overlay'; // Loading overlay component to match SettingsPage style

export default function ProfilePage() {
  const { session, loading } = useSession(); // Using useSession to get session data

  // Check if session is loading or not available
  if (loading) {
    return <LoadingOverlay />;
  }

  if (!session || !session.user) {
    // If no session or user, optionally redirect to login or show a message
    return <LoadingOverlay />;
  }

  return (
    <div className="flex flex-col min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="px-4 py-6 md:px-6 md:py-8 mb-16 sm:mb-0">
        <h1 className="text-2xl font-bold text-center mb-8">Profile</h1>

        <div className="max-w-md mx-auto space-y-6">
          {/* User Profile Section */}
          <div className="flex flex-col items-center">
            {/* Avatar with Skeleton while loading */}
            <Avatar className="w-32 h-32">
              {loading ? (
                <Skeleton className="w-full h-full rounded-full" />
              ) : (
                <AvatarImage
                  src={session.user?.user_metadata?.avatar_url || '/placeholder.svg'}
                  alt="Profile"
                />
              )}
              <AvatarFallback />
            </Avatar>

            {/* User Name with Skeleton while loading */}
            <h2 className="mt-4 text-xl font-semibold mb-2">
              {loading ? <Skeleton className="w-32 h-6" /> : session.user?.user_metadata?.name || 'John Doe'}
            </h2>

            {/* User Email with Skeleton while loading */}
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              {loading ? <Skeleton className="w-40 h-5" /> : session.user?.email || 'john.doe@example.com'}
            </div>
          </div>

          {/* Edit Profile Button */}
          <Link href="/profile/personal-data">
            <Button className="w-full mt-7">Edit Profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
