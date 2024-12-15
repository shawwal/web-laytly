'use client'

import { Metadata } from 'next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bell, Search, Bookmark, MoreHorizontal, Phone, Briefcase, Mail, ChevronLeft, PenSquare } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'User Profile | Chat App',
  description: 'View user profile and media',
}

interface ContactInfo {
  icon: typeof Phone
  label: string
  value: string
  type: string
}

const contactInfo: ContactInfo[] = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+821 7737 0250',
    type: 'phone'
  },
  {
    icon: Briefcase,
    label: 'Work',
    value: '+821 7737 0250',
    type: 'phone'
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'liusbong@gmail.com',
    type: 'email'
  },
]

const mediaItems = [
  '/placeholder.svg?height=400&width=400&text=Winter+1',
  '/placeholder.svg?height=400&width=400&text=Winter+2',
  '/placeholder.svg?height=400&width=400&text=Winter+3',
  '/placeholder.svg?height=400&width=400&text=Winter+4',
  '/placeholder.svg?height=400&width=400&text=Winter+5',
  '/placeholder.svg?height=400&width=400&text=Winter+6',
]

export default function UserProfilePage() {
  return (
    <div className="min-h-full bg-white dark:bg-gray-900">
      {/* Banner and Profile Section */}
      <div className="relative">
        <div className="h-48 w-full relative">
          <Image
            src="/placeholder.svg?height=200&width=800&text=Mountain+Banner"
            alt="Profile banner"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="rounded-full bg-white/20 backdrop-blur-lg">
              <ChevronLeft className="h-5 w-5 text-white" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full bg-white/20 backdrop-blur-lg">
            <PenSquare className="h-5 w-5 text-white" />
          </Button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -bottom-16">
          <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900">
            <AvatarImage src="https://i.pravatar.cc/128?u=kevin" />
            <AvatarFallback>KB</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* User Info */}
      <div className="pt-20 px-4 text-center">
        <h1 className="text-2xl font-bold">Kevin Lius Bong</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">online</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 px-4 py-6">
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <Bell className="h-5 w-5" />
          </div>
          <span className="text-xs">mute</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <Search className="h-5 w-5" />
          </div>
          <span className="text-xs">search</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <Bookmark className="h-5 w-5" />
          </div>
          <span className="text-xs">favorites</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center gap-1">
          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
            <MoreHorizontal className="h-5 w-5" />
          </div>
          <span className="text-xs">more</span>
        </Button>
      </div>

      {/* Contact Info */}
      <div className="px-4 space-y-4 max-w-md mx-auto">
        {contactInfo.map((info) => (
          <div key={info.label} className="flex items-center gap-4">
            <div className="p-2">
              <info.icon className="h-5 w-5 text-gray-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">{info.label}</p>
              <p className="font-medium">
                {info.type === 'phone' ? (
                  <a href={`tel:${info.value}`} className="hover:underline">
                    {info.value}
                  </a>
                ) : (
                  <a href={`mailto:${info.value}`} className="hover:underline">
                    {info.value}
                  </a>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Media Tabs */}
      <Tabs defaultValue="media" className="mt-6">
        <TabsList className="w-full justify-start px-4 border-b rounded-none h-auto overflow-x-auto flex-nowrap">
          {['Media', 'Files', 'Music', 'Links', 'Voice'].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab.toLowerCase()}
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none whitespace-nowrap"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="media" className="p-4">
          <div className="grid grid-cols-3 gap-1">
            {mediaItems.map((src, index) => (
              <div key={index} className="aspect-square relative">
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </TabsContent>
        {/* Add other TabsContent components for Files, Music, Links, and Voice tabs */}
        <TabsContent value="files">
          <div className="p-4 text-center text-gray-500">No files available</div>
        </TabsContent>
        <TabsContent value="music">
          <div className="p-4 text-center text-gray-500">No music available</div>
        </TabsContent>
        <TabsContent value="links">
          <div className="p-4 text-center text-gray-500">No links available</div>
        </TabsContent>
        <TabsContent value="voice">
          <div className="p-4 text-center text-gray-500">No voice messages available</div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

