// components/chat/message-list.tsx
import { useState, useEffect, useRef } from 'react'
import { MessageItem } from './message-item'
import { ImageGalleryModal } from './image-gallery-modal'
import { ChatMessage } from '@/types'

interface MessageListProps {
  messages: ChatMessage[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
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

  const handleOpenGallery = (images: string[], index: number) => {
    setGalleryImages(images)
    setGalleryInitialIndex(index)
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
        {messages.map((message) => {
          const isMe = message.sender_id === currentUserId
          return (
            <MessageItem
              key={message.id}
              message={message}
              isMe={isMe}
              playingAudio={playingAudio}
              onToggleAudio={handleAudioPlayback}
              onOpenGallery={handleOpenGallery}
            />
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
