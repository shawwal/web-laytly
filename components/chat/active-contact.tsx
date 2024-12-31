// component/chat/active-contact.tsx
'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'

interface ActiveContactProps {
  contact: any;
}

export function ActiveContact({ contact }: ActiveContactProps) {
  return (
    <Link 
      href={`/user/${contact.id}`}
      className="flex items-center gap-4 flex-1 hover:opacity-80 transition-opacity"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={`https://i.pravatar.cc/40?u=${contact.id}`} alt={contact.name} />
        <AvatarFallback>{contact.name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-lg font-semibold">{contact.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
      </div>
    </Link>
  )
}
