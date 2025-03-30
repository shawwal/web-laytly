'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Use Card for structure
import { ThumbsUp, ThumbsDown, MessageSquare, User, Calendar } from 'lucide-react'; // Import icons
import { formatDistanceToNow } from 'date-fns'; // For relative time
import { FeatureRequest } from '@/types/feature-request';

interface FeatureRequestItemProps {
  request: FeatureRequest;
  onVote: (requestId: string, voteType: 1 | -1 | null) => void; // null means remove vote
  currentUserId: string;
}

export default function FeatureRequestItem({ request, onVote, currentUserId }: FeatureRequestItemProps) {
  const [isVoting, setIsVoting] = useState(false); // Loading state for voting buttons

  const handleVoteClick = async (voteType: 1 | -1) => {
    if (isVoting) return; // Prevent double clicks
    setIsVoting(true);

    const newVoteType = request.user_vote === voteType ? null : voteType; // If clicking same button, undo vote
    await onVote(request.id, newVoteType);

    setIsVoting(false);
  };

  const timeAgo = request.created_at ? formatDistanceToNow(new Date(request.created_at), { addSuffix: true }) : '';

  return (
    <Card className="w-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">{request.title}</CardTitle>
         {/* Optional: Add submitter info if available */}
         {/* <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-4 pt-1">
            <span className='flex items-center gap-1'><User size={12} /> Submitted by User {request.user_id?.substring(0, 6)}...</span>
             <span className='flex items-center gap-1'><Calendar size={12} /> {timeAgo}</span>
         </div> */}
         <div className="text-xs text-gray-500 dark:text-gray-400 pt-1">
             <span className='flex items-center gap-1'><Calendar size={12} /> {timeAgo}</span>
         </div>
      </CardHeader>
      <CardContent className="pb-4">
        <CardDescription className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {request.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          {/* Like Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleVoteClick(1)}
            disabled={isVoting}
            className={`flex items-center space-x-1 px-2 py-1 h-auto rounded-md transition-colors ${
                request.user_vote === 1
                ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <ThumbsUp size={16} className={isVoting && request.user_vote !== 1 ? 'animate-pulse' : ''} />
            <span>{request.like_count ?? 0}</span>
          </Button>

          {/* Dislike Button */}
          <Button
             variant="ghost"
             size="sm"
             onClick={() => handleVoteClick(-1)}
             disabled={isVoting}
             className={`flex items-center space-x-1 px-2 py-1 h-auto rounded-md transition-colors ${
                 request.user_vote === -1
                 ? 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800'
                 : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
             }`}
           >
            <ThumbsDown size={16} className={isVoting && request.user_vote !== -1 ? 'animate-pulse' : ''} />
            <span>{request.dislike_count ?? 0}</span>
          </Button>
        </div>
        {/* Optional: Comments count/link */}
         {/* <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400 flex items-center space-x-1 px-2 py-1 h-auto">
            <MessageSquare size={16} />
            <span>0</span>
        </Button> */}
        {/* Display Status */}
         <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
             {request.status || 'Open'}
         </span>
      </CardFooter>
    </Card>
  );
}