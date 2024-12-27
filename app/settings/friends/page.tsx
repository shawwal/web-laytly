'use client'

import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { ContactList } from '@/components/settings/contact'

const friends = [
  { id: '1', name: 'Aaron Tan', phone: '091234567', avatar: 'https://i.pravatar.cc/150?u=aaron' },
  { id: '2', name: 'Amelia Lim', phone: '081234570', avatar: 'https://i.pravatar.cc/150?u=amelia' },
  { id: '3', name: 'Alvin Chua', phone: '074321987', avatar: 'https://i.pravatar.cc/150?u=alvin' },
  { id: '4', name: 'Bryan Teo', phone: '095678912', avatar: 'https://i.pravatar.cc/150?u=bryan' },
  { id: '5', name: 'Blake Wong', phone: '078345789', avatar: 'https://i.pravatar.cc/150?u=blake' },
  { id: '6', name: 'Brittany Chua', phone: '082345789', avatar: 'https://i.pravatar.cc/150?u=brittany' },
  { id: '7', name: 'Cheryl Lee', phone: '090987543', avatar: 'https://i.pravatar.cc/150?u=cheryl' },
  { id: '8', name: 'Carl Goh', phone: '065432198', avatar: 'https://i.pravatar.cc/150?u=carl' },
  { id: '9', name: 'Catherine Koh', phone: '098876432', avatar: 'https://i.pravatar.cc/150?u=catherine' },
]

export default function FriendListPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4 p-4 border-b bg-white dark:bg-gray-800">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">Friends List</h1>
        <span className="text-sm text-gray-500">{friends.length} friends</span>
      </div>

      <ContactList contacts={friends} search={search} setSearch={setSearch} />
    </div>
  )
}
