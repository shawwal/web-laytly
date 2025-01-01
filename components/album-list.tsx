// src/components/album-list.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Album } from '@/types';
import { fetchAlbums } from '@/utils/albumUtils';
import { Skeleton } from '@/components/ui/skeleton'; // Optional: Skeleton for loading state
import { AlbumCard } from '@/components/album-card';
import { useChat } from '@/contexts/chat-context';

interface AlbumListProps {
  onRefresh: () => void;
}

export function AlbumList({ onRefresh }: AlbumListProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeContactId } = useChat();
  const chatId = activeContactId as string;
  const containerRef = useRef<HTMLDivElement>(null); // To measure container width


  useEffect(() => {
    const getAlbums = async () => {
      setLoading(true);
      const fetchedAlbums = await fetchAlbums(chatId);
      setAlbums(fetchedAlbums);
      setLoading(false);
    };
    getAlbums();
  }, [onRefresh, chatId]);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-y-auto pb-20 md:pb-4 mb-16 md:mb-0"
    >
      {loading ? (
        // Optional: Use skeleton loading
        <Skeleton className="h-40 w-full" />
      ) : (
        albums.map((album) => (
          <AlbumCard key={album.id} album={album} onDelete={() => {}} onRename={() => {}} />
        ))
      )}
    </div>
  );
}
