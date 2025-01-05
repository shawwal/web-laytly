// components/ImageSelector.tsx

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';

interface ImageSelectorProps {
  onImagesSelected: (files: File[]) => void;
}

export const ImageSelector = ({ onImagesSelected }: ImageSelectorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onImagesSelected(files);
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleImageSelect}
      />
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="rounded-full"
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon className="w-6 h-6" />
      </Button>
    </div>
  );
};
