'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageIcon, Mic, Smile, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'  // Use the new custom hook
import { RecordingUI } from '@/components/recording-ui'  // Use the new Recording UI component

interface MessageInputProps {
  onSend: (content: string, audioBlob?: Blob, images?: File[]) => void
  onFocus: () => void
  onBlur: () => void
}

export function MessageInput({ onSend, onFocus, onBlur }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const { isRecording, recordingTime, startRecording, stopRecording } = useAudioRecorder(); // Use the custom hook

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onFocus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files].slice(0, 6)); // Limit to 6 images
  };

  const handleSendImages = () => {
    if (selectedImages.length > 0) {
      onSend('📸 Image(s) selected', undefined, selectedImages);
      setSelectedImages([]); // Clear images after sending
    }
  };

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

      {/* Input field */}
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
        className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        onFocus={handleFocus}
        onBlur={onBlur}
      />

      {/* Emoji button */}
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="rounded-full"
      >
        <Smile className="w-6 h-6" />
      </Button>

      {/* Microphone button for recording */}
      <Button
        type="button"
        size="icon"
        variant={isRecording ? "destructive" : "ghost"}
        className={cn("rounded-full", isRecording && "animate-pulse")}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? (
          <Square className="w-6 h-6" />  // Stop recording icon
        ) : (
          <Mic className="w-6 h-6" />  // Microphone icon
        )}
      </Button>

      {/* Render Recording UI */}
      <RecordingUI 
        isRecording={isRecording}
        recordingTime={recordingTime}
        stopRecording={stopRecording}
      />
    </form>
  );
}
