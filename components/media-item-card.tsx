// src/components/media-item-card.tsx
import { MediaActions } from './media-actions';
import Image from 'next/image';
import { MediaItem } from '@/types';

interface MediaItemCardProps {
  item: MediaItem;
  groupIndex: number;
  itemIndex: number;
  onMediaSelect: (groupIndex: number, itemIndex: number) => void;
  onLike: (groupIndex: number, itemIndex: number) => void;
  onSave: (groupIndex: number, itemIndex: number) => void;
}

export function MediaItemCard({
  item,
  groupIndex,
  itemIndex,
  onMediaSelect,
  onLike,
  onSave
}: MediaItemCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      <div
        className="relative aspect-square cursor-pointer"
        onClick={() => onMediaSelect(groupIndex, itemIndex)}
      >
        <Image
          src={item.imageUrl}
          alt={item.caption || 'Media Item'}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <MediaActions
          item={item}
          groupIndex={groupIndex}
          itemIndex={itemIndex}
          onLike={onLike}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
