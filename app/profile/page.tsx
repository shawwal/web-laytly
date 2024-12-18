'use client'

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton component
import useSession from '@/hooks/useSessions'; // Your useSession hook
import Link from 'next/link'

export default function ProfilePage() {
  const session = useSession(); // Using useSession to get session data
  const [loading, setLoading] = useState<boolean>(true); // Manage loading state

  useEffect(() => {
    if (session) {
      setLoading(false); // Once session is available, stop loading
    }
  }, [session]); // Effect will run when session changes

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Header Section */}
      <div className="border-b dark:border-gray-800 p-4 backdrop-blur-xl bg-white/50 dark:bg-gray-900/50">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {/* Main Profile Section */}
      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* User Profile Section */}
          <div className="flex flex-col items-center">
            {/* Avatar with Skeleton while loading */}
            <Avatar className="w-32 h-32">
              {/* <Skeleton className="w-full h-full rounded-full" /> */}
              {loading ? (
                <Skeleton className="w-full h-full rounded-full" />
              ) : (
                <AvatarImage src={session?.user?.user_metadata?.avatar_url || '/placeholder.svg'} alt="Profile" />
              )}
              <AvatarFallback />
            </Avatar>

            {/* User Name with Skeleton while loading */}
            <h2 className="mt-4 text-xl font-semibold mb-2">
              {loading ? <Skeleton className="w-32 h-6" /> : session?.user?.user_metadata?.name || 'John Doe'}
            </h2>

            {/* User Email with Skeleton while loading */}
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              {loading ? <Skeleton className="w-40 h-5" /> : session?.user?.email || 'john.doe@example.com'}
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
