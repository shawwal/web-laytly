'use client'

import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState } from 'react'
import { ContactList } from '@/components/settings/contact'
import { friends } from '@/data/sample'

export default function FriendListPage() {
  const [search, setSearch] = useState('')

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4 p-4 border-b bg-white dark:bg-gray-800">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
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
