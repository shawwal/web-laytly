import { useState, useEffect, useRef } from 'react';
import { MessageItem } from './message-item';
import { ImageGalleryModal } from './image-gallery-modal';
import { ChatMessage } from '@/types';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const [isListRendered, setIsListRendered] = useState(false);

  useEffect(() => {
    // Check if messages are available, and scroll to the bottom only if they are
    if (listRef.current && messages.length > 0) {
      requestAnimationFrame(() => {
        // Ensure the list scrolls to the bottom after rendering new messages
        listRef.current!.scrollTop = listRef.current!.scrollHeight;
        setIsListRendered(true);
      });
    } else if (messages.length === 0) {
      // If no messages, we can just render the list immediately
      setIsListRendered(true);
    }
  }, [messages]);

  const handleAudioPlayback = (messageId: string, audioUrl: string) => {
    if (!audioRefs.current[messageId]) {
      audioRefs.current[messageId] = new Audio(audioUrl);
      audioRefs.current[messageId].addEventListener('ended', () => {
        setPlayingAudio(null);
      });
    }

    if (playingAudio === messageId) {
      audioRefs.current[messageId].pause();
      setPlayingAudio(null);
    } else {
      if (playingAudio && audioRefs.current[playingAudio]) {
        audioRefs.current[playingAudio].pause();
      }
      audioRefs.current[messageId].play();
      setPlayingAudio(messageId);
    }
  };

  const handleOpenGallery = (images: string[], index: number) => {
    setGalleryImages(images);
    setGalleryInitialIndex(index);
  };

  return (
    <>
      {/* Chat Message List with hidden opacity until it's fully rendered */}
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 flex flex-col transition-opacity duration-1000 ${
          isListRendered ? 'opacity-100' : 'opacity-0'
        }`}
        ref={listRef}
      >
        {messages.map((message) => {
          const isMe = message.sender_id === currentUserId;
          return (
            <MessageItem
              key={message.id}
              message={message}
              isMe={isMe}
              playingAudio={playingAudio}
              onToggleAudio={handleAudioPlayback}
              onOpenGallery={handleOpenGallery}
            />
          );
        })}
      </div>

      {/* Image gallery modal */}
      <ImageGalleryModal
        isOpen={galleryImages.length > 0}
        onClose={() => setGalleryImages([])}
        images={galleryImages}
        initialIndex={galleryInitialIndex}
      />
    </>
  );
}
