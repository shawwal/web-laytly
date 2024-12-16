import { Metadata } from 'next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
// import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Profile | Chat App',
  description: 'View and edit your profile',
}

export default function ProfilePage() {
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="border-b dark:border-gray-800 p-4 backdrop-blur-xl bg-white/50 dark:bg-gray-900/50">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>
      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex flex-col items-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-xl font-semibold">John Doe</h2>
            <p className="text-gray-500 dark:text-gray-400">john.doe@example.com</p>
          </div>
          <a href="/profile/personal-data" >
            <Button className="w-full">Edit Profile</Button>
          </a>
        </div>
      </div>
    </div>
  )
}

