// useChatMedia.ts

import { useState, useEffect } from 'react';
import { fetchMedia } from '@/utils/mediaUtils';

interface useChatMediaProps {
  mediaType: 'image' | 'video' | any;
  mediaIdentifier: string;
}

const useChatMedia = ({ mediaType, mediaIdentifier }: useChatMediaProps) => {
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const getMedia = async () => {
      setIsLoading(true);
      const uri = await fetchMedia(mediaType, mediaIdentifier);
      if (isMounted) {
        setMediaUri(uri);
        setIsLoading(false);
      }
    };

    if (mediaIdentifier) {
      getMedia();
    }

    return () => {
      isMounted = false;
    };
  }, [mediaType, mediaIdentifier]);

  return { mediaUri, isLoading };
};

export default useChatMedia;
