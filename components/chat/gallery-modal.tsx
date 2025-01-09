'use client';
import React, { useState, useEffect } from 'react';
import { fetchAlbumImages } from '@/utils/albumDetailsUtils'; // Import the album fetching utility
import Image from 'next/image';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumId: string;
}

export function GalleryModal({ isOpen, onClose, albumId }: GalleryModalProps) {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      const loadImages = async () => {
        setLoading(true);
        const fetchedImages = await fetchAlbumImages(albumId);
        setImages(fetchedImages);
        setLoading(false);
      };
      loadImages();
    }
  }, [isOpen, albumId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full p-4 overflow-y-auto h-[80vh]">
        <button
          className="absolute top-4 right-4 text-white bg-red-500 p-2 rounded-full"
          onClick={onClose}
        >
          X
        </button>

        <h2 className="text-lg font-medium text-center mb-4">Album Gallery</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">Loading...</div>
        ) : images.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-gray-500">No images available</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image: any) => (
              <div key={image.id} className="relative aspect-square">
                <Image
                  src={image.file_path}
                  alt={`Item ${image.id}`}
                  fill
                  className="object-cover rounded-lg"
                  unoptimized={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
