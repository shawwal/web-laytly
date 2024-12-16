'use client'

import { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ImageGalleryModal } from './image-gallery-modal'
import Link from 'next/link'
import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  content: string
  senderId: string
  timestamp: number
  status: 'sending' | 'sent' | 'seen'
  images?: string[]
  audioUrl?: string
}

export function MessageList({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0)
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleAudioPlayback = (messageId: string, audioUrl: string) => {
    if (!audioRefs.current[messageId]) {
      audioRefs.current[messageId] = new Audio(audioUrl)
      audioRefs.current[messageId].addEventListener('ended', () => {
        setPlayingAudio(null)
      })
    }

    if (playingAudio === messageId) {
      audioRefs.current[messageId].pause()
      setPlayingAudio(null)
    } else {
      // Stop any currently playing audio
      if (playingAudio && audioRefs.current[playingAudio]) {
        audioRefs.current[playingAudio].pause()
      }
      audioRefs.current[messageId].play()
      setPlayingAudio(messageId)
    }
  }

  const renderImages = (images: string[], messageId: string) => {
    const totalImages = images.length
    const displayImages = images.slice(0, 4)
    const remainingImages = totalImages - 4

    return (
      <div 
        className={cn(
          "grid gap-1 cursor-pointer",
          totalImages === 1 ? "grid-cols-1" :
          totalImages === 2 ? "grid-cols-2" :
          "grid-cols-2"
        )}
        onClick={() => {
          setGalleryImages(images)
          setGalleryInitialIndex(0)
        }}
      >
        {displayImages.map((image, index) => (
          <div
            key={`${messageId}-${index}`}
            className={cn(
              "relative rounded-lg overflow-hidden",
              index === 3 && remainingImages > 0 && "relative"
            )}
          >
            <Image
              src={image || '/placeholder.svg'}
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
    <>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
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
                <Link href={`/user/${message.senderId}`}>
                  <Avatar className="w-6 h-6 mb-1">
                    <AvatarImage src={`https://i.pravatar.cc/24?u=${message.senderId}`} alt="User avatar" />
                    <AvatarFallback>{message.senderId[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
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
                {message.images && message.images.length > 0 && renderImages(message.images, message.id)}
                {message.audioUrl ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-white/10"
                      onClick={() => handleAudioPlayback(message.id, message.audioUrl!)}
                    >
                      {playingAudio === message.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <span>Voice message</span>
                  </div>
                ) : (
                  <p>{message.content}</p>
                )}
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
      <ImageGalleryModal
        isOpen={galleryImages.length > 0}
        onClose={() => setGalleryImages([])}
        images={galleryImages}
        initialIndex={galleryInitialIndex}
      />
    </>
  )
}

