/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, LinkIcon, Settings, Menu, User, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import useSession from '@/hooks/useSession'; // Import custom hook for session

const navItems = [
  {
    title: 'Chats',
    icon: MessageCircle,
    href: '/',
  },
  {
    title: 'Connect',
    icon: LinkIcon,
    href: '/connect',
  },
  {
    title: 'Feature Request',
    icon: Lightbulb,
    href: '/feature-request',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },
]

export function NavMenu() {
  const pathname = usePathname()
  const { session, loading } = useSession(); // Use session hook
  const [mounted, setMounted] = useState(false);
  const avatarUrl =  session?.user?.user_metadata?.avatar_url as string;
  // UseEffect to handle client-side behavior after mount (hydration fix)
  useEffect(() => {
    setMounted(true); // Set mounted to true after the component mounts
  }, []);

  // If still loading or component isn't mounted, show nothing or loading state
  if (!mounted || loading) {
    return null;
  }

  // If session doesn't exist, don't render the nav menu
  if (!session) {
    return null; // Don't render the nav menu if there's no session
  }

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-col items-center w-16 border-r dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-xl">
        <div className="flex flex-col items-center gap-4 py-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/">
              <Menu className="w-5 h-5" />
              <span className="sr-only">Menu</span>
            </Link>
          </Button>
        </div>
        <div className="flex-1 flex flex-col items-center gap-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                variant={isActive ? "secondary" : "ghost"}
                size="icon"
                asChild
                className={cn(
                  "rounded-full",
                  isActive && "bg-blue-50 dark:bg-blue-900"
                )}
              >
                <Link href={item.href}>
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive && "text-blue-600 dark:text-blue-400"
                  )} />
                  <span className="sr-only">{item.title}</span>
                </Link>
              </Button>
            )
          })}
        </div>
        <div className="py-4">
          {/* Avatar instead of User icon */}
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/profile">
              <Avatar className="w-9 h-9">
                <AvatarImage src={avatarUrl || "/placeholder.svg?height=36&width=36"} alt="Profile" />
                <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
              </Avatar>
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-xl" />
        <nav className="relative flex items-center justify-around p-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Button
                key={item.href}
                variant="ghost"
                size="icon"
                asChild
                className={cn(
                  "rounded-full",
                  isActive && "bg-blue-50 dark:bg-blue-900"
                )}
              >
                <Link href={item.href}>
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive && "text-blue-600 dark:text-blue-400"
                  )} />
                  <span className="sr-only">{item.title}</span>
                </Link>
              </Button>
            )
          })}
          {/* Avatar instead of User icon for mobile */}
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/profile">
              <Avatar className="w-9 h-9">
                {/* @ts-ignore */}
                <AvatarImage src={avatarUrl || "/placeholder.svg?height=36&width=36"} alt="Profile" />
                <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
              </Avatar>
              <span className="sr-only">Profile</span>
            </Link>
          </Button>
        </nav>
      </div>
    </>
  )
}
