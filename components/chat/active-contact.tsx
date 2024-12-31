'use client'
import Link from 'next/link'
import { AvatarWithName } from '@/components/avatar-with-name'

interface ActiveContactProps {
  contact: {
    id: string;
    friend_id: string;
    name: string;
    avatar: string;
  };
}

export function ActiveContact({ contact }: ActiveContactProps) {
  const isFriendAvailable = Boolean(contact.friend_id);  // Check if friend_id is available
  const avatarUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/` + (contact.avatar || '/default-avatar.png');

  return (
    <div className={`flex items-center gap-4 ${!isFriendAvailable ? 'opacity-100' : 'hover:opacity-80 transition-opacity'}`}>
      {/* Conditionally render Link or div for disabled state */}
      {isFriendAvailable ? (
        <Link href={`/user/${contact.friend_id}`} className="flex items-center gap-4">
          <AvatarWithName avatarUrl={avatarUrl} name={contact.name} />
        </Link>
      ) : (
        <div className="flex items-center gap-4">
          <AvatarWithName avatarUrl={avatarUrl} name={contact.name} />
        </div>
      )}
    </div>
  )
}
