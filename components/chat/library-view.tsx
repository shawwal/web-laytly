import { Heart, MessageCircle, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { MediaModal } from './media-modal'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import fetchThumbnails from '@/utils/fetchThumbnails'
import { useChat } from '@/contexts/chat-context'
import { Skeleton } from '@/components/ui/skeleton'  // Import skeleton component

interface MediaItem {
  id: string
  imageUrl: string
  likes: number
  comments: number
  saved: boolean
  liked: boolean
  caption?: string
  user: {
    name: string
    avatar: string
    username: string
  }
  timestamp: Date
}

interface MonthGroup {
  month: string
  items: MediaItem[]
}

export function LibraryView() {
  const [mediaGroups, setMediaGroups] = useState<MonthGroup[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<{ item: MediaItem, groupIndex: number, itemIndex: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);  // Loading state for the thumbnails
  const { activeContactId } = useChat();  // Get the active contact ID from the chat context
  const chatId = activeContactId as string;  // Replace this with actual chat ID logic

  useEffect(() => {
    const loadThumbnails = async () => {
      setLoading(true);  // Start loading state
      const thumbnails = await fetchThumbnails(chatId);  // Fetch thumbnails
      setLoading(false);  // End loading state
      // console.log('thumbnails', thumbnails)
      if (thumbnails.length > 0) {
        const newGroups = thumbnails.reduce((acc: any[], file: any) => {
          // Extract timestamp from file.id by splitting at the underscore and taking the second part
          const timestamp = file.id.split('_')[1]?.split('.')[0]; // This will get the number between 'video_' or 'image_'
          
          if (timestamp) {
            const date = new Date(Number(timestamp));  // Convert timestamp to a Date object
            
            // Get the month and year in "Month Year" format
            const month = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
            const mediaItem = {
              id: file.id,
              imageUrl: file.image,
              likes: 0,
              comments: 0,
              saved: false,
              liked: false,
              user: {
                name: 'Sample User',
                avatar: '/default-avatar.png',
                username: 'sampleuser'
              },
              timestamp: date,  // Store the actual date object
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
    setMediaGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const item = newGroups[groupIndex].items[itemIndex];
      item.liked = !item.liked;
      item.likes += item.liked ? 1 : -1;
      return newGroups;
    });
  };

  const handleSave = (groupIndex: number, itemIndex: number) => {
    setMediaGroups(prevGroups => {
      const newGroups = [...prevGroups];
      const item = newGroups[groupIndex].items[itemIndex];
      item.saved = !item.saved;
      return newGroups;
    });
  };

  const handleMediaSelect = (groupIndex: number, itemIndex: number) => {
    const item = mediaGroups[groupIndex].items[itemIndex];
    setSelectedMedia({ item, groupIndex, itemIndex });
  };

  const handleNextMedia = () => {
    if (!selectedMedia) return;
    const { groupIndex, itemIndex } = selectedMedia;
    const currentGroup = mediaGroups[groupIndex];
    
    if (itemIndex + 1 < currentGroup.items.length) {
      handleMediaSelect(groupIndex, itemIndex + 1);
    } else if (groupIndex + 1 < mediaGroups.length) {
      handleMediaSelect(groupIndex + 1, 0);
    }
  };

  const handlePreviousMedia = () => {
    if (!selectedMedia) return;
    const { groupIndex, itemIndex } = selectedMedia;
    
    if (itemIndex > 0) {
      handleMediaSelect(groupIndex, itemIndex - 1);
    } else if (groupIndex > 0) {
      const previousGroup = mediaGroups[groupIndex - 1];
      handleMediaSelect(groupIndex - 1, previousGroup.items.length - 1);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 p-4 overflow-y-auto pb-20 md:pb-4 mb-16 md:mb-0">
        {loading ? (
          // Show skeletons when loading
          Array.from({ length: 5 }).map((_, groupIndex) => (
            <div key={groupIndex}>
              <Skeleton className="h-6 w-1/4 mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, itemIndex) => (
                  <div key={itemIndex} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <div className="relative aspect-square">
                      <Skeleton className="h-full w-full" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-5 w-5" />
                          <Skeleton className="h-5 w-5" />
                        </div>
                        <Skeleton className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          // Once data is loaded, render the actual content
          mediaGroups.map((group, groupIndex) => (
            <div key={group.month}>
              <h2 className="text-lg font-semibold mb-4">{group.month}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {group.items.map((item, itemIndex) => (
                  <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                    <div 
                      className="relative aspect-square cursor-pointer"
                      onClick={() => handleMediaSelect(groupIndex, itemIndex)}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.caption || 'Media Item'}
                        fill  // Use fill
                        sizes="(max-width: 768px) 100vw, 33vw"  // Set sizes for responsive layout
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      {/* <div className="flex items-center gap-2 mb-2">
                        <Link href={`/user/${item.user.username}`}>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={item.user.avatar} />
                            <AvatarFallback>{item.user.name[0]}</AvatarFallback>
                          </Avatar>
                        </Link>
                        <Link href={`/user/${item.user.username}`} className="text-sm font-medium hover:underline">
                          {item.user.name}
                        </Link>
                      </div> */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 h-auto p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(groupIndex, itemIndex);
                            }}
                          >
                            <Heart className={cn(
                              "h-5 w-5",
                              item.liked && "fill-red-500 text-red-500"
                            )} />
                            <span className="text-sm">{item.likes}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1 h-auto p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMediaSelect(groupIndex, itemIndex);
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
                            handleSave(groupIndex, itemIndex);
                          }}
                        >
                          <Bookmark className={cn(
                            "h-5 w-5",
                            item.saved && "fill-current"
                          )} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

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
  )
}
