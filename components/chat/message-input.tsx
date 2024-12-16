'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageIcon, Mic, Smile, Square, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MessageInputProps {
  onSend: (content: string, audioBlob?: Blob, images?: File[]) => void
}

export function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage('')
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(prev => [...prev, ...files].slice(0, 6)) // Limit to 6 images
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' })
        onSend('🎤 Voice message', audioBlob)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const bottomOffset = window.innerHeight - window.visualViewport.height
        document.documentElement.style.setProperty('--keyboard-height', `${bottomOffset}px`)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSendImages = () => {
    if (selectedImages.length > 0) {
      onSend('📸 Image(s) selected', undefined, selectedImages)
      setSelectedImages([]) // Clear images after sending
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-2 sticky bottom-0 md:bottom-4 mx-4 mb-4 md:mb-0">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="rounded-full"
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon className="w-6 h-6" />
      </Button>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
        className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="relative">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="rounded-full"
        >
          <Smile className="w-6 h-6" />
        </Button>
      </div>
      <Button
        type="button"
        size="icon"
        variant={isRecording ? "destructive" : "ghost"}
        className={cn("rounded-full", isRecording && "animate-pulse")}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? (
          <Square className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </Button>
      {isRecording && (
        <div className="absolute bottom-full left-0 p-2 bg-red-100 dark:bg-red-900 rounded-lg shadow-lg mb-2">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{recordingTime}s</span>
          </div>
        </div>
      )}
      {/* <Button
        type="button"
        size="icon"
        variant="ghost"
        onClick={handleSendImages}
      >
        Send Images
      </Button> */}
    </form>
  )
}
