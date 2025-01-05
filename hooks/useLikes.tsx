// useLikes.ts
import { useEffect, useState } from 'react';
import { toggleLike, fetchLikeCount, hasUserLiked } from '@/utils/likesUtils';

interface UseLikesProps {
  chatId: string;
  itemId: string;
  userId: string;
}

interface UseLikesReturn {
  liked: boolean;
  likeCount: number;
  loading: boolean;
  error: string | null;
  toggleLikeStatus: () => Promise<void>;
}

export const useLikes = ({ chatId, itemId, userId }: UseLikesProps): UseLikesReturn => {
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeLikes = async () => {
      if (!itemId) {
        setLoading(false);
        return;
      }

      try {
        if (userId) {
          const userLiked = await hasUserLiked(userId, chatId, itemId);
          setLiked(userLiked);
        }
        const count = await fetchLikeCount(chatId, itemId);
        setLikeCount(count);
      } catch (err: any) {
        console.error('Error initializing likes:', err);
        setError(null); // Default to no likes without error
        setLiked(false);
        setLikeCount(0);
      } finally {
        setLoading(false);
      }
    };

    initializeLikes();
  }, [chatId, itemId, userId]);

  const toggleLikeStatus = async () => {
    if (!userId) {
      setError('User not authenticated.');
      return;
    }

    // Optimistic UI update
    const previousLiked = liked;
    const previousCount = likeCount;

    setLiked(!liked);
    setLikeCount(prev => (liked ? prev - 1 : prev + 1));

    try {
      const result = await toggleLike(userId, chatId, itemId);
      setLiked(result.liked);
    } catch (err) {
      // Revert changes in case of error
      setLiked(previousLiked);
      setLikeCount(previousCount);
      console.error('Error toggling like:', err);
      setError('Failed to toggle like.');
    }
  };

  return { liked, likeCount, loading, error, toggleLikeStatus };
};
