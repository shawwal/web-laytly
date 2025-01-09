// components/chat/image-gallery.tsx
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  messageId: string
  onOpenGallery: (images: string[], index: number) => void
}

export function ImageGallery({ images, messageId, onOpenGallery }: ImageGalleryProps) {
  const totalImages = images.length
  const displayImages = images.slice(0, 4)
  const remainingImages = totalImages - 4

  return (
    <div
      className="grid gap-1 cursor-pointer"
      onClick={() => onOpenGallery(images, 0)}
    >
      {displayImages.map((image, index) => (
        <div key={`${messageId}-${index}`} className="relative rounded-lg overflow-hidden">
          <Image
            src={image || '/placeholder.svg'}
            alt="Shared image"
            width={200}
            height={200}
            className="object-cover w-full h-full"
            unoptimized={true}
          />
          {index === 3 && remainingImages > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-bold">
              +{remainingImages}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
