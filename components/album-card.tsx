// src/components/album-card.tsx
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Album } from '@/types'; // Adjust the import path
import { Skeleton } from '@/components/ui/skeleton'; // Import your Skeleton component
import { supabase } from '@/lib/supabase';

interface AlbumCardProps {
  album: Album;
  onDelete: (albumId: string) => void;
  onRename: (albumId: string, newName: string) => void;
}

export function AlbumCard({ album, onDelete, onRename }: AlbumCardProps) {
  const [loading, setLoading] = useState(true);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // State to track if we're on the client

  // Initialize router only on the client side
  const router = useRouter();

  // Fetch the cover image URL from Supabase (or any other storage)
  const getCoverImageUrl = useCallback(async () => {
    if (album.cover_image) {
      const { data, error } = await supabase.storage
        .from('shared_files') // Replace with your bucket name
        .createSignedUrl(album.cover_image, 60 * 60); // URL valid for 1 hour

      if (error) {
        console.error('Error fetching cover image URL:', error.message);
        setCoverImageUrl(null);
      } else {
        setCoverImageUrl(data.signedUrl);
      }
    } else {
      setCoverImageUrl(null); // No cover image available
    }
    setLoading(false);
  }, [album.cover_image]);

  useEffect(() => {
    // Set the client-side flag to true after the component mounts
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      getCoverImageUrl();
    }
  }, [isClient, getCoverImageUrl]);

  // Handle album click (navigate to album details)
  const handleAlbumClick = () => {
    // if (router) {
    //   router.push(`/albums/${album.id}`);
    // }
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
        onContextMenu={handleAlbumLongPress} // Right-click for long press
        style={{ position: 'relative', width: '100%', height: 'auto' }}
      >
        {loading ? (
          <Skeleton className="w-full h-full aspect-square" />
        ) : coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={album.name}
            fill  // Use `layout="fill"` for the image to fill the container
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"  // Adjust sizes for responsiveness
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
    </div>
  );
}
