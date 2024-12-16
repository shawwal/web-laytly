'use client'

import { ChevronLeft, Search, Plus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'

interface Contact {
  id: string
  name: string
  phone: string
  avatar: string
}

const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const contacts: Contact[] = [
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

export default function ContactsPage() {
  const [search, setSearch] = useState('')

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.phone.includes(search)
  )

  const groupedContacts = alphabet.reduce((acc, letter) => {
    const letterContacts = filteredContacts.filter(contact => 
      contact.name.toUpperCase().startsWith(letter)
    )
    if (letterContacts.length > 0) {
      acc[letter] = letterContacts
    }
    return acc
  }, {} as Record<string, Contact[]>)

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4 p-4 border-b bg-white dark:bg-gray-800">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">Contact List</h1>
        <span className="text-sm text-gray-500">450 contacts</span>
      </div>

      <div className="p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search name or number"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white dark:bg-gray-800"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg divide-y dark:divide-gray-700">
            <div className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">New Contact</h3>
                <p className="text-sm text-gray-500">Add a contact to start chatting</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">New Group</h3>
                <p className="text-sm text-gray-500">Create a group to share ideas</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute right-0 top-0 bottom-0 w-6 flex flex-col justify-center text-xs font-medium text-gray-500">
              {alphabet.map(letter => (
                <button
                  key={letter}
                  className="py-0.5 hover:text-blue-500"
                  onClick={() => {
                    document.getElementById(letter)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>

            <div className="pr-6 space-y-4">
              {Object.entries(groupedContacts).map(([letter, contacts]) => (
                <div key={letter} id={letter}>
                  <h2 className="text-sm font-medium text-gray-500 mb-2">{letter}</h2>
                  <div className="bg-white dark:bg-gray-800 rounded-lg divide-y dark:divide-gray-700">
                    {contacts.map(contact => (
                      <div key={contact.id} className="flex items-center gap-4 p-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={contact.avatar} />
                          <AvatarFallback>{contact.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{contact.name}</h3>
                          <p className="text-sm text-gray-500">{contact.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

