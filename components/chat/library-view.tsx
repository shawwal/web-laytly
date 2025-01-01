// src/components/library-view.tsx
import { useEffect, useState } from 'react';
import { MediaItemCard } from '@/components/media-item-card';
import { SkeletonLoading } from '@/components/skeleton-loading';
import { MediaItem, MonthGroup } from '@/types';
import fetchThumbnails from '@/utils/fetchThumbnails';
import { useChat } from '@/contexts/chat-context';

export function LibraryView() {
  const [mediaGroups, setMediaGroups] = useState<MonthGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { activeContactId } = useChat();
  const chatId = activeContactId as string;

  useEffect(() => {
    const loadThumbnails = async () => {
      setLoading(true);
      const thumbnails = await fetchThumbnails(chatId);
      setLoading(false);

      if (thumbnails.length > 0) {
        const newGroups = thumbnails.reduce((acc: MonthGroup[], file: any) => {
          const timestamp = file.id.split('_')[1]?.split('.')[0];
          if (timestamp) {
            const date = new Date(Number(timestamp));
            const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });

            const mediaItem: MediaItem = {
              id: file.id,
              imageUrl: file.image,
              likes: 0,
              comments: 0,
              saved: false,
              liked: false,
              user: {
                name: 'Sample User',
                avatar: '/default-avatar.png',
                username: 'sampleuser',
              },
              timestamp: date,
            };

            const existingGroup = acc.find((group) => group.month === month);
            if (existingGroup) {
              existingGroup.items.push(mediaItem);
            } else {
              acc.push({ month, items: [mediaItem] });
            }
          }

          return acc;
        }, []);
        setMediaGroups(newGroups);
      }
    };

    loadThumbnails();
  }, [chatId]);

  const handleLike = (groupIndex: number, itemIndex: number) => {
    setMediaGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const item = newGroups[groupIndex].items[itemIndex];
      item.liked = !item.liked;
      item.likes += item.liked ? 1 : -1;
      return newGroups;
    });
  };

  const handleSave = (groupIndex: number, itemIndex: number) => {
    setMediaGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const item = newGroups[groupIndex].items[itemIndex];
      item.saved = !item.saved;
      return newGroups;
    });
  };

  return (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto pb-20 md:pb-4 mb-16 md:mb-0">
      {loading ? (
        <SkeletonLoading />
      ) : (
        mediaGroups.map((group, groupIndex) => (
          <div key={group.month}>
            <h2 className="text-lg font-semibold mb-4">{group.month}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.items.map((item, itemIndex) => (
                <MediaItemCard
                  key={item.id}
                  item={item}
                  groupIndex={groupIndex}
                  itemIndex={itemIndex}
                  onMediaSelect={() => {}}
                  onLike={handleLike}
                  onSave={handleSave}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
