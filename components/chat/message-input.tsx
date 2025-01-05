'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smile, Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { RecordingUI } from '@/components/recording-ui';
import { ImageSelector } from '@/components/image-selector'; // Import ImageSelector
import { useImageSender } from '@/hooks/useImageSender'; // Import useImageSender hook

interface MessageInputProps {
  onSend: (content: string, audioBlob?: Blob, images?: File[]) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function MessageInput({ onSend, onFocus, onBlur }: MessageInputProps) {
  const [message, setMessage] = useState('');

  const { isRecording, recordingTime, startRecording, stopRecording } = useAudioRecorder();

  const { handleImageSelect } = useImageSender(onSend); // Use the custom hook for images

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

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-2 sticky bottom-0 md:bottom-4 mx-4 mb-4 md:mb-0">
      {/* ImageSelector Component */}
      <ImageSelector onImagesSelected={handleImageSelect} />

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
