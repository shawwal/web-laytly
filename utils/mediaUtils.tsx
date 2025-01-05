// utils/mediaUtils.ts
const CACHE_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
import { downloadImage } from '@/utils/downloadImage';
import { downloadVideo } from '@/utils/downloadVideo';
/**
 * Fetches media (image or video) with caching.
 * @param mediaType - Type of media ('image' or 'video').
 * @param mediaIdentifier - Unique identifier for the media.
 * @returns The URL of the media.
 */
export const fetchMedia = async (
  mediaType: 'image' | 'video',
  mediaIdentifier: string
): Promise<string | null> => {
  try {
    const cacheKey = `media_${mediaIdentifier}`;
    const cachedMediaUrl = localStorage.getItem(cacheKey);

    // Check if we have a valid cached URL
    if (cachedMediaUrl) {
      const cacheTimestamp = parseInt(localStorage.getItem(`${cacheKey}_timestamp`) || '0', 10);
      if (Date.now() - cacheTimestamp < CACHE_EXPIRATION_MS) {
        return cachedMediaUrl;
      } else {
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(`${cacheKey}_timestamp`);
      }
    }

    // Fetch the media URL from your utility functions
    const mediaUrl =
      mediaType === 'image'
        ? await downloadImage(mediaIdentifier)
        : await downloadVideo(mediaIdentifier);

    if (!mediaUrl) {
      return null;
    }

    // Cache the URL in localStorage
    localStorage.setItem(cacheKey, mediaUrl);
    localStorage.setItem(`${cacheKey}_timestamp`, `${Date.now()}`);

    return mediaUrl;
  } catch (error) {
    console.error('Error fetching media:', error);
    return null;
  }
};

