'use client'

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, MoreHorizontal } from 'lucide-react'

interface PhotoModalProps {
  isOpen: boolean
  onClose: () => void
  media: {
    imageUrl: string
    user: {
      name: string
      avatar: string
      username: string
    }
    timestamp: Date
  }
}

export function PhotoModal({ isOpen, onClose, media }: PhotoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-screen-lg p-0">
        <DialogTitle className="sr-only">Full Photo View</DialogTitle>
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={onClose}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src={media.user.avatar} />
                <AvatarFallback>{media.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-white">
                <p className="font-medium text-sm">{media.user.name}</p>
                <p className="text-xs opacity-80">
                  Updated at {media.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} {media.timestamp.toLocaleDateString(undefined, {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-white">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          <img
            src={media.imageUrl}
            alt=""
            className="w-full h-full object-contain max-h-[90vh]"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

