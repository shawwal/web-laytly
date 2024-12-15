'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Image, Mic, Smile } from 'lucide-react'

interface MessageInputProps {
  onSend: (content: string) => void
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-2">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="rounded-full"
      >
        <Image className="w-6 h-6" />
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
        className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="rounded-full"
      >
        <Smile className="w-6 h-6" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="rounded-full"
      >
        <Mic className="w-6 h-6" />
      </Button>
    </form>
  )
}

