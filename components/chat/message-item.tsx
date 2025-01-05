// components/chat/message-item.tsx
import { AvatarDisplay } from './avatar-display'
import { AudioPlayer } from './audio-player'
import { ImageGallery } from './image-gallery'
import { useChat } from '@/contexts/chat-context';
import { stringToColor } from '@/utils/string-to-color'
import { useTheme } from 'next-themes'
import MediaContent from '@/components/media-content'
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
  const sender = message.sender.username || message.sender.email;
  const senderColor = stringToColor(sender); // Generate a color based on the sender's name/email
  const { isGroup } = useChat();
  const { theme }  = useTheme();

  return (
    <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
      {showAvatar && !isMe && (
        isGroup &&
        <AvatarDisplay
          userId={message.sender.id}
          avatarUrl={message.sender.avatar_url}
          username={message.sender.username}
          email={message.sender.email}
        />
      )}
      <div
        className={`rounded-2xl px-4 py-2 max-w-[100%] ${isMe ? 'text-white rounded-br-sm' : ` text-white rounded-bl-sm`}`}
        style={{
          backgroundColor: isMe 
            ? '#3B82F6' 
            : theme === 'light' 
              ? '#B8BCC5'  // Light mode background
              : '#26252A', // Dark mode background
        }}
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
          <>
          {isGroup && !isMe && (
            <p className="font-semibold white-space-pre-wrap text-sm line-clamp-1" style={{ color: senderColor }}>
              {sender}
            </p>
          )}
          <MediaContent content={message.content} />
        </>
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
