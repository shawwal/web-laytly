'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Album } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase';
import { GalleryModal } from '@/components/chat/gallery-modal'; // Import the GalleryModal

interface AlbumCardProps {
  album: Album;
  onDelete: (albumId: string) => void;
  onRename: (albumId: string, newName: string) => void;
}

export function AlbumCard({ album, onDelete, onRename }: AlbumCardProps) {
  const [loading, setLoading] = useState(true);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch the cover image URL from Supabase
  const getCoverImageUrl = useCallback(async () => {
    if (album.cover_image) {
      const { data, error } = await supabase.storage
        .from('shared_files')
        .createSignedUrl(album.cover_image, 60 * 60);

      if (error) {
        console.error('Error fetching cover image URL:', error.message);
        setCoverImageUrl(null);
      } else {
        setCoverImageUrl(data.signedUrl);
      }
    } else {
      setCoverImageUrl(null);
    }
    setLoading(false);
  }, [album.cover_image]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      getCoverImageUrl();
    }
  }, [isClient, getCoverImageUrl]);

  // Handle album click to open the modal
  const handleAlbumClick = () => {
    setIsModalOpen(true);
  };

  // Handle long press (show options - rename or delete)
  const handleAlbumLongPress = () => {
    if (confirm('Would you like to rename or delete this album?')) {
      const action = prompt('Type "rename" to rename or "delete" to delete the album');
      if (action === 'rename') {
        const newName = prompt('Enter new album name:');
        if (newName) {
          onRename(album.id, newName);
        }
      } else if (action === 'delete') {
        onDelete(album.id);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      <div
        className="relative aspect-square cursor-pointer"
        onClick={handleAlbumClick}
        onContextMenu={handleAlbumLongPress}
      >
        {loading ? (
          <Skeleton className="w-full h-full aspect-square" />
        ) : coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={album.name}
            fill
            className="object-cover"
            unoptimized={true}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-md flex justify-center items-center">
            <span>No Cover</span>
          </div>
        )}
      </div>

      <div className="album-info p-3">
        <h3 className="album-title text-sm font-medium">
          {loading ? <Skeleton className="w-2/3 h-4" /> : album.name}
        </h3>
        <div className="album-count text-xs text-gray-500">
          {loading ? <Skeleton className="w-1/4 h-3" /> : `${album.item_count} items`}
        </div>
      </div>

      {/* Gallery Modal */}
      <GalleryModal
        albumName={album.name}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        albumId={album.id}
      />
    </div>
  );
}
