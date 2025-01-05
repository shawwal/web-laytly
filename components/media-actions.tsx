// src/components/media-actions.tsx
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaItem } from '@/types';
import { cn } from '@/lib/utils';
import { useLikes } from '@/hooks/useLikes';  // Import the useLikes hook
import { useChat } from '@/contexts/chat-context';

interface MediaActionsProps {
  item: MediaItem;
  groupIndex: number;
  itemIndex: number;
  userId: string;  // Add userId as a prop
  onSave: (groupIndex: number, itemIndex: number) => void;
}

export function MediaActions({
  item,
  groupIndex,
  itemIndex,
  userId,  // Accept userId as a prop
  onSave
}: MediaActionsProps) {
  const { activeContactId } = useChat() as any;  // Assuming chatId is available from context

  // Call the useLikes hook to handle liking functionality
  const {
    liked,
    likeCount,
    loading: likeLoading,
    error: likeError,
    toggleLikeStatus,
  } = useLikes({
    chatId: activeContactId,
    itemId: item.id,  // Each media item has a unique ID
    userId,  // Use the userId passed down from props
  });

  // Handle like action
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click handler
    if (!likeLoading) {
      toggleLikeStatus();  // Toggle like status using the custom hook
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 h-auto p-1"
          onClick={handleLike}
        >
          <Heart
            className={cn(
              'h-5 w-5',
              liked && 'fill-red-500 text-red-500'
            )}
          />
          <span className="text-sm">{likeCount}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 h-auto p-1"
          onClick={(e) => {
            e.stopPropagation();
            // Handle navigate to comments
          }}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm">{item.comments}</span>
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={(e) => {
          e.stopPropagation();
          onSave(groupIndex, itemIndex);
        }}
      >
        <Bookmark
          className={cn(
            'h-5 w-5',
            item.saved && 'fill-current'
          )}
        />
      </Button>
    </div>
  );
}
