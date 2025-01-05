// hooks/useImageSender.ts

import { useState } from 'react';

export const useImageSender = (onSend: (content: string, audioBlob?: Blob, images?: File[]) => void) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleImageSelect = (files: File[]) => {
    setSelectedImages(prev => [...prev, ...files].slice(0, 6)); // Limit to 6 images
  };

  const handleSendImages = () => {
    if (selectedImages.length > 0) {
      onSend('📸 Image(s) selected', undefined, selectedImages);
      setSelectedImages([]); // Clear images after sending
    }
  };

  return {
    selectedImages,
    handleImageSelect,
    handleSendImages
  };
};
