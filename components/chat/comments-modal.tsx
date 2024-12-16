'use client'

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Heart, MoreHorizontal } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useState } from "react"

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  likes: number
  timestamp: Date
  liked?: boolean
}

const dummyComments: Comment[] = [
  {
    id: '1',
    user: {
      name: 'Luka Doncic',
      avatar: '/placeholder.svg',
    },
    content: 'Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been',
    likes: 1,
    timestamp: new Date('2024-02-17T10:45:00'),
  },
  // Add more dummy comments as needed
]

interface CommentsModalProps {
  isOpen: boolean
  onClose: () => void
  mediaId: string
}

export function CommentsModal({ isOpen, onClose, mediaId }: CommentsModalProps) {
  const [comments, setComments] = useState(dummyComments)
  const [newComment, setNewComment] = useState('')

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: 'Luka Doncic',
        avatar: '/placeholder.svg',
      },
      content: newComment,
      likes: 0,
      timestamp: new Date(),
    }

    setComments(prev => [comment, ...prev])
    setNewComment('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        <DialogTitle className="sr-only">Comments</DialogTitle>
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onClose}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="font-semibold">Comments</h2>
          </div>
          <Button variant="ghost" size="sm">
            Most relevant
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.avatar} />
                <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium">{comment.user.name}</p>
                    <p className="text-sm">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        {comment.timestamp.toLocaleDateString()}
                      </span>
                      <button className="text-xs font-medium">
                        {comment.likes} likes
                      </button>
                      <button className="text-xs font-medium">Reply</button>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t">
          <form onSubmit={handleAddComment} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
              className="flex-1"
            />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

