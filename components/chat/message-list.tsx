import { useState, useEffect, useRef } from 'react';
import { MessageItem } from './message-item';
import { ImageGalleryModal } from './image-gallery-modal';
// import { ChatMessage } from '@/types';

interface MessageListProps {
  messages: any[];
  currentUserId: string;
  onInputFocus: boolean; // Callback for when the input is focused
}

function ScrollToBottom() {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'instant' });
    }
  }, []);

  return <div ref={elementRef} />;
}

export function MessageList({ messages, currentUserId, onInputFocus }: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const [isListRendered, setIsListRendered] = useState(false);

  // Reverse the messages so the newest one is at the bottom
  const reversedMessages = [...messages].reverse();

  useEffect(() => {
    // Set a small timeout to simulate the message loading time, then set the list as rendered
    if (messages.length > 0) {
      setTimeout(() => {
        setIsListRendered(true);
      }, 300); // Adjust this timeout to suit your needs (500ms for example)
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

  // Scroll to the bottom when the list is fully rendered or input field is focused
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, isListRendered]);

  // Trigger scroll to bottom when the input is focused
  useEffect(() => {
    if (onInputFocus === true) {
      if (listRef.current) {
        listRef.current.scrollTo({
          top: listRef.current.scrollHeight, // Scroll to the bottom
          behavior: 'smooth', // Enable smooth scrolling
        });
      }
    }
  }, [onInputFocus]); // Run when onInputFocus changes (i.e., when input is focused)

  return (
    <>
      {/* Chat Message List with conditional rendering */}
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 flex flex-col transition-opacity duration-300 no-scrollbar ${
          isListRendered ? 'opacity-100' : 'opacity-0'
        }`}
        ref={listRef}
      >
        {reversedMessages.map((message) => {
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

        {/* Scroll to the bottom after the list is rendered */}
        {isListRendered && <ScrollToBottom />}
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
