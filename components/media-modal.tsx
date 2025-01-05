'use client'

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, ChevronLeft } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"
import { CommentsModal } from "./comments-modal"
import { PhotoModal } from "./photo-modal"

interface MediaModalProps {
  isOpen: boolean
  onClose: () => void
  media: {
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
  onNext: () => void
  onPrevious: () => void
  hasNext: boolean
  hasPrevious: boolean
}

export function MediaModal({ 
  isOpen, 
  onClose, 
  media,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}: MediaModalProps) {
  const [isLiked, setIsLiked] = useState(media.liked)
  const [isSaved, setIsSaved] = useState(media.saved)
  const [showComments, setShowComments] = useState(false)
  const [showFullPhoto, setShowFullPhoto] = useState(false)
  const [likesCount, setLikesCount] = useState(media.likes)
  
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsLiked(media.liked)
    setIsSaved(media.saved)
    setLikesCount(media.likes)
  }, [media])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return

    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    
    const deltaX = touchEndX - touchStartX.current
    const deltaY = touchEndY - touchStartY.current
    
    // Check if the swipe was more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 50 && hasPrevious) {
        onPrevious()
      } else if (deltaX < -50 && hasNext) {
        onNext()
      }
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-md p-0 overflow-hidden"
          ref={contentRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <DialogTitle className="sr-only">Media Details</DialogTitle>
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={onClose}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                {/* <AvatarImage src={media.user.avatar} />
                <AvatarFallback>{media.user.name[0]}</AvatarFallback> */}
              </Avatar>
              <div>
                {/* <p className="font-medium text-sm">{media.user.name}</p>
                <p className="text-xs text-gray-500">@{media.user.username}</p> */}
              </div>
            </div>
            <Button variant="ghost" size="icon">
              {/* <MoreHorizontal className="h-5 w-5" /> */}
            </Button>
          </div>

          <div 
            className="relative aspect-square cursor-pointer"
            onClick={() => setShowFullPhoto(true)}
          >
            <img
              src={media.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  className="group"
                >
                  <Heart className={cn(
                    "h-6 w-6 transition-colors",
                    isLiked && "fill-red-500 text-red-500"
                  )} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowComments(true)}
                >
                  <MessageCircle className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-6 w-6" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
              >
                <Bookmark className={cn(
                  "h-6 w-6",
                  isSaved && "fill-current"
                )} />
              </Button>
            </div>

            <div className="space-y-1">
              {/* <p className="font-medium text-sm">{likesCount.toLocaleString()} likes</p> */}
              {media.caption && (
                <p className="text-sm">
                  <span className="font-medium">{media.user.name}</span>{' '}
                  {media.caption}
                </p>
              )}
              {/* <button
                onClick={() => setShowComments(true)}
                className="text-sm text-gray-500"
              >
                View all {media.comments} comments
              </button> */}
              <p className="text-xs text-gray-500">
                {media.timestamp.toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        mediaId={media.id}
      />

      <PhotoModal
        isOpen={showFullPhoto}
        onClose={() => setShowFullPhoto(false)}
        media={media}
      />
    </>
  )
}

