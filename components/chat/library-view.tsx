// src/components/library-view.tsx
import { useEffect, useState } from 'react';
import { MediaItemCard } from '@/components/media-item-card';
import { SkeletonLoading } from '@/components/skeleton-loading';
import { MediaItem, MonthGroup } from '@/types';
import fetchThumbnails from '@/utils/fetchThumbnails';
import { useChat } from '@/contexts/chat-context';
import { MediaModal } from '@/components/media-modal'; // Import MediaModal component

interface LibraryViewProps {
  currentUserId: string;
}

export function LibraryView({ currentUserId }: LibraryViewProps) {
  const [mediaGroups, setMediaGroups] = useState<MonthGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { activeContactId } = useChat();
  const chatId = activeContactId as string;
  
  // State to manage selected media for the modal
  const [selectedMedia, setSelectedMedia] = useState<{ item: MediaItem, groupIndex: number, itemIndex: number } | null>(null);

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

  const handleSave = (groupIndex: number, itemIndex: number) => {
    setMediaGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      const item = newGroups[groupIndex].items[itemIndex];
      item.saved = !item.saved;
      return newGroups;
    });
  };

  // Function to open the media modal when an item is selected
  const handleMediaSelect = (groupIndex: number, itemIndex: number) => {
    const item = mediaGroups[groupIndex].items[itemIndex];
    setSelectedMedia({ item, groupIndex, itemIndex });
  };

  // Functions to navigate through the media modal
  const handleNextMedia = () => {
    if (!selectedMedia) return;
    const { groupIndex, itemIndex } = selectedMedia;
    const currentGroup = mediaGroups[groupIndex];
    
    if (itemIndex + 1 < currentGroup.items.length) {
      // Next item in current group
      handleMediaSelect(groupIndex, itemIndex + 1);
    } else if (groupIndex + 1 < mediaGroups.length) {
      // First item in next group
      handleMediaSelect(groupIndex + 1, 0);
    }
  };

  const handlePreviousMedia = () => {
    if (!selectedMedia) return;
    const { groupIndex, itemIndex } = selectedMedia;
    
    if (itemIndex > 0) {
      // Previous item in current group
      handleMediaSelect(groupIndex, itemIndex - 1);
    } else if (groupIndex > 0) {
      // Last item in previous group
      const previousGroup = mediaGroups[groupIndex - 1];
      handleMediaSelect(groupIndex - 1, previousGroup.items.length - 1);
    }
  };

  return (
    <>
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
                    userId={currentUserId}
                    onMediaSelect={() => handleMediaSelect(groupIndex, itemIndex)} // Open the modal on selection
                    onSave={handleSave}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Render MediaModal when selectedMedia is not null */}
      {selectedMedia && (
        <MediaModal
          isOpen={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          media={selectedMedia.item}
          onNext={handleNextMedia}
          onPrevious={handlePreviousMedia}
          hasNext={
            selectedMedia.itemIndex < mediaGroups[selectedMedia.groupIndex].items.length - 1 ||
            selectedMedia.groupIndex < mediaGroups.length - 1
          }
          hasPrevious={
            selectedMedia.itemIndex > 0 ||
            selectedMedia.groupIndex > 0
          }
        />
      )}
    </>
  );
}
