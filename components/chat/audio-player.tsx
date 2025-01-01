// components/chat/audio-player.tsx
import { Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AudioPlayerProps {
  messageId: string
  audioUrl: string
  playingAudio: string | null
  onToggleAudio: (messageId: string, audioUrl: string) => void
}

export function AudioPlayer({ messageId, audioUrl, playingAudio, onToggleAudio }: AudioPlayerProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-white/10"
        onClick={() => onToggleAudio(messageId, audioUrl)}
      >
        {playingAudio === messageId ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      <span>Voice message</span>
    </div>
  )
}
