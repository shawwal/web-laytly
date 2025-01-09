import React, { useState } from 'react';
import Image from 'next/image'; // Importing Next.js Image component
import useChatMedia from '@/hooks/useChatMedia'; // Using custom hook for media fetching

interface MessageContentProps {
  content: string; // Full message content, including possible media identifiers
}

const MessageContent: React.FC<MessageContentProps> = ({ content }) => {

  // Extract media identifiers from the message content
  const imageIdentifierMatch = content?.match(/\[Image: ([^\]]+)\]/);
  const videoIdentifierMatch = content?.match(/\[Video: ([^\]]+)\]/);

  const imageIdentifier = imageIdentifierMatch ? imageIdentifierMatch[1] : null;
  const videoIdentifier = videoIdentifierMatch ? videoIdentifierMatch[1] : null;

  // Determine the remaining text after removing media identifiers
  const remainingText = imageIdentifier
    ? content.replace(`[Image: ${imageIdentifier}]`, '').trim()
    : videoIdentifier
      ? content.replace(`[Video: ${videoIdentifier}]`, '').trim()
      : content;

  // Determine media type (either 'image' or 'video')
  const mediaType = imageIdentifier ? 'image' : videoIdentifier ? 'video' : null;

  // Use the custom hook to fetch media based on the identifier and type
  const { mediaUri, isLoading } = useChatMedia({
    mediaType: mediaType || '', // Default to empty if no media type
    mediaIdentifier: imageIdentifier || videoIdentifier || '', // Use appropriate identifier
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal open/close

  // Open modal when image is clicked
  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) {
    return <p>Loading...</p>; // Simple loading indicator while media is being fetched
  }

  if (mediaUri) {
    if (mediaType === 'image') {
      return (
        <div>
          {/* Main Image */}
          <div
            className="relative w-[80vw] h-[80vw] max-w-[300px] max-h-[300px]" // Square container with responsive size
            onClick={handleImageClick}
          >
            <Image
              src={mediaUri}
              alt="Message Media"
              fill
              sizes="(max-width: 768px) 100vw, 33vw" // Responsive sizes for optimal loading
              style={{
                objectFit: 'cover',
              }}
              className="rounded-lg cursor-pointer"
              unoptimized={true}
            />
          </div>

          {/* Modal for Image Zoom */}
          {isModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm dark:bg-opacity-70"
              onClick={handleCloseModal} // Close modal on background click
            >
              <div
                onClick={(e) => e.stopPropagation()} // Prevent closing the modal when clicking inside
              >
                {/* Image Container */}
                <div className="relative w-auto h-auto flex justify-center items-center overflow-hidden">
                  <Image
                    src={mediaUri}
                    alt="Zoomed Message Media"
                    width={400} // Set a base width for large images
                    height={200} // Set a base height for large images
                    style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} // Add these styles for aspect ratio
                    className="rounded-lg"
                    unoptimized={true}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (mediaType === 'video') {
      return (
        <div className="relative max-w-full max-h-96">
          <video controls className="max-w-full max-h-96 rounded-lg shadow-lg">
            <source src={mediaUri} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
  }

  return <p className="break-words whitespace-pre-wrap">{remainingText}</p>; // Render remaining text if no media
};

export default MessageContent;
