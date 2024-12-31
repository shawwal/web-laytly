// components/avatar-with-name.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AvatarWithNameProps {
  avatarUrl: string;
  name: string;
}

export function AvatarWithName({ avatarUrl, name }: AvatarWithNameProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} alt={name} className="object-cover w-full h-full rounded-full" />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-lg font-semibold">{name}</h2>
      </div>
    </div>
  )
}
