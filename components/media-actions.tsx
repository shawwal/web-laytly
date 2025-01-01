// src/components/media-actions.tsx
import { Heart, MessageCircle, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaItem } from '@/types';
import { cn } from '@/lib/utils';

interface MediaActionsProps {
  item: MediaItem;
  groupIndex: number;
  itemIndex: number;
  onLike: (groupIndex: number, itemIndex: number) => void;
  onSave: (groupIndex: number, itemIndex: number) => void;
}

export function MediaActions({
  item,
  groupIndex,
  itemIndex,
  onLike,
  onSave
}: MediaActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 h-auto p-1"
          onClick={(e) => {
            e.stopPropagation();
            onLike(groupIndex, itemIndex);
          }}
        >
          <Heart
            className={cn(
              'h-5 w-5',
              item.liked && 'fill-red-500 text-red-500'
            )}
          />
          <span className="text-sm">{item.likes}</span>
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
