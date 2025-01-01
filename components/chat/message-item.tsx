// components/chat/message-item.tsx
import { AvatarDisplay } from './avatar-display'
import { AudioPlayer } from './audio-player'
import { ImageGallery } from './image-gallery'
// import { ChatMessage } from '@/types'

interface MessageItemProps {
  message: any
  isMe: boolean
  playingAudio: string | null
  onToggleAudio: (messageId: string, audioUrl: string) => void
  onOpenGallery: (images: string[], index: number) => void
}

export function MessageItem({ message, isMe, playingAudio, onToggleAudio, onOpenGallery }: MessageItemProps) {
  const showAvatar = !isMe && (!message.previousSender || message.previousSender !== message.senderId)

  return (
    <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
      {showAvatar && !isMe && (
        <AvatarDisplay
          userId={message.sender.id}
          avatarUrl={message.sender.avatar_url}
          username={message.sender.username}
          email={message.sender.email}
        />
      )}
      <div
        className={`rounded-2xl px-4 py-2 ${isMe ? 'bg-[#3B82F6] text-white rounded-br-sm' : 'bg-[#5BA4A4] text-white rounded-bl-sm'}`}
      >
        {message.images && message.images.length > 0 && (
          <ImageGallery images={message.images} messageId={message.id} onOpenGallery={onOpenGallery} />
        )}
        {message.audioUrl ? (
          <AudioPlayer
            messageId={message.id}
            audioUrl={message.audioUrl}
            playingAudio={playingAudio}
            onToggleAudio={onToggleAudio}
          />
        ) : (
          <p>{message.content}</p>
        )}
        <div className={`text-[10px] mt-1 ${isMe ? 'text-blue-100' : 'text-teal-100'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {isMe && <span className="ml-2">{message.status === 'seen' ? '✓✓' : '✓'}</span>}
        </div>
      </div>
    </div>
  )
}
