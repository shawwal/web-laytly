'use client'

import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { MediaModal } from './media-modal'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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

const generateDummyData = (): MonthGroup[] => {
  const months = ['November 2024', 'October 2024']
  return months.map((month, monthIndex) => ({
    month,
    items: Array.from({ length: 4 }, (_, i) => ({
      id: `${monthIndex}-${i}`,
      imageUrl: `https://picsum.photos/seed/${monthIndex}-${i}/400/400`,
      likes: Math.floor(Math.random() * 1000) + 500,
      comments: Math.floor(Math.random() * 50) + 10,
      saved: false,
      liked: false,
      caption: `Photo ${i + 1} from ${month}`,
      user: {
        name: 'Luka Doncic',
        avatar: `https://i.pravatar.cc/150?u=kevin-${monthIndex}-${i}`,
        username: 'kevinlius'
      },
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    }))
  }))
}

const dummyData = generateDummyData()

export function LibraryView() {
  const [mediaGroups, setMediaGroups] = useState<MonthGroup[]>(dummyData)
  const [selectedMedia, setSelectedMedia] = useState<{item: MediaItem, groupIndex: number, itemIndex: number} | null>(null)

  const handleLike = (groupIndex: number, itemIndex: number) => {
    setMediaGroups(prevGroups => {
      const newGroups = [...prevGroups]
      const item = newGroups[groupIndex].items[itemIndex]
      item.liked = !item.liked
      item.likes += item.liked ? 1 : -1
      return newGroups
    })
  }

  const handleSave = (groupIndex: number, itemIndex: number) => {
    setMediaGroups(prevGroups => {
      const newGroups = [...prevGroups]
      const item = newGroups[groupIndex].items[itemIndex]
      item.saved = !item.saved
      return newGroups
    })
  }

  const handleMediaSelect = (groupIndex: number, itemIndex: number) => {
    const item = mediaGroups[groupIndex].items[itemIndex]
    setSelectedMedia({ item, groupIndex, itemIndex })
  }

  const handleNextMedia = () => {
    if (!selectedMedia) return
    const { groupIndex, itemIndex } = selectedMedia
    const currentGroup = mediaGroups[groupIndex]
    
    if (itemIndex + 1 < currentGroup.items.length) {
      // Next item in current group
      handleMediaSelect(groupIndex, itemIndex + 1)
    } else if (groupIndex + 1 < mediaGroups.length) {
      // First item in next group
      handleMediaSelect(groupIndex + 1, 0)
    }
  }

  const handlePreviousMedia = () => {
    if (!selectedMedia) return
    const { groupIndex, itemIndex } = selectedMedia
    
    if (itemIndex > 0) {
      // Previous item in current group
      handleMediaSelect(groupIndex, itemIndex - 1)
    } else if (groupIndex > 0) {
      // Last item in previous group
      const previousGroup = mediaGroups[groupIndex - 1]
      handleMediaSelect(groupIndex - 1, previousGroup.items.length - 1)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-4 overflow-y-auto">
        {mediaGroups.map((group, groupIndex) => (
          <div key={group.month}>
            <h2 className="text-lg font-semibold mb-4">{group.month}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.items.map((item, itemIndex) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
                >
                  <div 
                    className="relative aspect-square cursor-pointer"
                    onClick={() => handleMediaSelect(groupIndex, itemIndex)}
                  >
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized={true}
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Link href={`/user/${item.user.username}`}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={item.user.avatar} />
                          <AvatarFallback>{item.user.name[0]}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <Link href={`/user/${item.user.username}`} className="text-sm font-medium hover:underline">
                        {item.user.name}
                      </Link>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 h-auto p-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleLike(groupIndex, itemIndex)
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
                            e.stopPropagation()
                            handleMediaSelect(groupIndex, itemIndex)
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
                          e.stopPropagation()
                          handleSave(groupIndex, itemIndex)
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
        ))}
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

