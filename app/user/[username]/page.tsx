'use client'

import { Bell, Search, Bookmark, MoreHorizontal, Phone, Briefcase, Mail, ChevronLeft, PenSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const contactInfo = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+821 7737 0250',
    href: 'tel:+821 7737 0250'
  },
  {
    icon: Briefcase,
    label: 'Work',
    value: '+821 7737 0250',
    href: 'tel:+821 7737 0250'
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'liusbong@gmail.com',
    href: 'mailto:liusbong@gmail.com'
  },
]

const mediaItems = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  type: 'image',
  url: `/placeholder.svg?height=400&width=400&text=Photo+${i + 1}`,
}))

export default function UserProfilePage() {
  return (
    <div className="min-h-full bg-white dark:bg-gray-900">
      {/* Banner and Profile Section */}
      <div className="relative h-[250px] md:h-[350px]">
        <Image
          src="/placeholder.svg?height=350&width=1920&text=Banner"
          alt="Profile banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between z-10">
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="rounded-full bg-white/20 backdrop-blur-lg text-white hover:bg-white/30">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full bg-white/20 backdrop-blur-lg text-white hover:bg-white/30">
            <PenSquare className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="relative px-4 pb-4 -mt-20 max-w-4xl mx-auto">
        <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-900 mx-auto">
          <AvatarImage src="https://i.pravatar.cc/200" />
          <AvatarFallback>KB</AvatarFallback>
        </Avatar>

        <div className="mt-4 text-center">
          <h1 className="text-2xl font-bold">Luka Doncic</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">online</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-6 max-w-sm mx-auto">
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-3">
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
              <Bell className="h-5 w-5" />
            </div>
            <span className="text-xs">mute</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-3">
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
              <Search className="h-5 w-5" />
            </div>
            <span className="text-xs">search</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-3">
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
              <Bookmark className="h-5 w-5" />
            </div>
            <span className="text-xs">favorites</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-3">
            <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
              <MoreHorizontal className="h-5 w-5" />
            </div>
            <span className="text-xs">more</span>
          </Button>
        </div>

        {/* Contact Info */}
        <div className="mt-6 space-y-4 max-w-sm mx-auto">
          {contactInfo.map((info) => (
            <a
              key={info.label}
              href={info.href}
              className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="p-2">
                <info.icon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500">{info.label}</p>
                <p className="font-medium truncate">{info.value}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Media Tabs */}
        <Tabs defaultValue="media" className="mt-8">
          <TabsList className="w-full grid grid-cols-5 bg-transparent gap-4 p-0 h-auto">
            {['Media', 'Files', 'Music', 'Links', 'Voice'].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className={cn(
                  "flex-1 px-0 py-2 text-sm data-[state=active]:bg-transparent",
                  "border-b-2 border-transparent data-[state=active]:border-blue-500",
                  "rounded-none font-medium"
                )}
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="media" className="mt-6">
            <div className="grid grid-cols-3 gap-1 md:gap-2">
              {mediaItems.map((item) => (
                <div key={item.id} className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    className="object-cover hover:opacity-90 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="files" className="mt-6">
            <div className="text-center text-gray-500 py-8">No files available</div>
          </TabsContent>
          
          <TabsContent value="music" className="mt-6">
            <div className="text-center text-gray-500 py-8">No music available</div>
          </TabsContent>
          
          <TabsContent value="links" className="mt-6">
            <div className="text-center text-gray-500 py-8">No links available</div>
          </TabsContent>
          
          <TabsContent value="voice" className="mt-6">
            <div className="text-center text-gray-500 py-8">No voice messages available</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

