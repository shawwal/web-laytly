// components/chat/avatar-display.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

interface AvatarDisplayProps {
  userId: string
  avatarUrl: string
  username: string
  email: string
}

export function AvatarDisplay({ userId, avatarUrl, username, email }: AvatarDisplayProps) {
  return (
    <Link href={`/user/${userId}`}>
      <Avatar className="w-6 h-6 mb-1">
        <AvatarImage
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${avatarUrl}`}
          alt={username}
        />
        {username || email &&
          <AvatarFallback>
            {username ? username[0].toUpperCase() : email[0].toUpperCase()}
          </AvatarFallback>
        }
      </Avatar>
    </Link>
  )
}
