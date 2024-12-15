'use client'

import { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: number
  status: 'sending' | 'sent' | 'seen'
  images?: string[]
}

export function MessageList({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const renderImages = (images: string[]) => {
    const totalImages = images.length
    const displayImages = images.slice(0, 4)
    const remainingImages = totalImages - 4

    return (
      <div className={cn(
        "grid gap-1",
        totalImages === 1 ? "grid-cols-1" :
        totalImages === 2 ? "grid-cols-2" :
        "grid-cols-2"
      )}>
        {displayImages.map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative rounded-lg overflow-hidden",
              index === 3 && remainingImages > 0 && "relative"
            )}
          >
            <Image
              src={image}
              alt="Shared image"
              width={200}
              height={200}
              className="object-cover w-full h-full"
            />
            {index === 3 && remainingImages > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-bold">
                +{remainingImages}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => {
        const isMe = message.senderId === 'me'
        const showAvatar = !isMe && (!messages[index - 1] || messages[index - 1].senderId !== message.senderId)

        return (
          <div
            key={message.id}
            className={cn(
              'flex items-end gap-2 max-w-[85%]',
              isMe ? 'ml-auto flex-row-reverse' : ''
            )}
          >
            {showAvatar && !isMe && (
              <Avatar className="w-6 h-6 mb-1">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
            {!showAvatar && !isMe && <div className="w-6" />}
            <div
              className={cn(
                'rounded-2xl px-4 py-2',
                isMe
                  ? 'bg-[#3B82F6] text-white rounded-br-sm'
                  : 'bg-[#5BA4A4] text-white rounded-bl-sm'
              )}
            >
              {message.images && renderImages(message.images)}
              <p>{message.content}</p>
              <div className={cn(
                "text-[10px] mt-1",
                isMe ? "text-blue-100" : "text-teal-100"
              )}>
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {isMe && (
                  <span className="ml-2">
                    {message.status === 'seen' ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}

