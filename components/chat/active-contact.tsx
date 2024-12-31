// component/chat/active-contact.tsx
'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

interface ActiveContactProps {
  contact: {
    id: string,
    name: string,
    avatar: string,
  };
}

export function ActiveContact({ contact }: ActiveContactProps) {
  return (
    <Link 
      href={`/user/${contact.id}`}
      className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage 
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/` + contact.avatar || '/default-avatar.png'} 
          alt={contact.name}
          className="object-cover w-full h-full rounded-full" 
        />
        <AvatarFallback>{contact.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-lg font-semibold">{contact.name}</h2>
        {/* <p className="text-sm text-gray-500 dark:text-gray-400">Online</p> */}
      </div>
    </Link>
  )
}
