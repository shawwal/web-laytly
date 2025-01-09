
// import { Camera } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Image from 'next/image';
import { useState } from 'react';
import { uploadImageToSupabase, deleteImageFromBucket } from '@/utils/uploadImageToSupabase';
import { updateBannerUrlInProfile } from '@/utils/updateBannerUrlInProfile'; 
import { useToast } from '@/components/ui/use-toast';

interface ProfileHeaderProps {
  userId: string; // Assuming userId is passed as a prop
  profileImage?: string
  onProfileImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  // onBannerImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  isLoading: boolean
  bannerImage: string;
  currentBannerImage: string;
  onBannerImageUpdate: (url: string) => void; // Callback to update parent component's state
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userId,
  profileImage,
  onProfileImageChange,
  // onBannerImageChange,
  bannerImage,
  currentBannerImage,
  onBannerImageUpdate,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleBannerImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      console.log('Selected file for banner update: ', file.name);
      try {
        // Step 1: Upload the new banner image to Supabase and get the URL
        console.log('Starting image upload to Supabase...');
        const newBannerUrl = await uploadImageToSupabase(file, 'banners', userId);
        console.log('Uploaded new banner image, URL: ', newBannerUrl);

        if (!newBannerUrl) {
          throw new Error('Failed to upload banner image');
        }

        // Step 2: If there is an existing banner, delete it from the bucket (optional)
        if (currentBannerImage && currentBannerImage !== '/placeholder.svg') {
          const oldImageFileName = currentBannerImage.split('/').pop() || '';
          console.log('Deleting old banner image from bucket: ', oldImageFileName);
          await deleteImageFromBucket('banners', { name: oldImageFileName });
          console.log('Old banner image deleted from bucket');
        }

        // Step 3: Update the banner URL in the parent component state
        console.log('Updating parent component state with new banner URL...');
        onBannerImageUpdate(newBannerUrl);
        console.log('Parent state updated successfully with new banner URL');

        // Step 4: Update the profile's banner_url in Supabase
        console.log('Updating banner_url in the database...');
        const updatedProfile = await updateBannerUrlInProfile(userId, newBannerUrl);
        console.log('Updated profile in the database: ', updatedProfile);

        if (!updatedProfile) {
          throw new Error('Failed to update banner URL in database');
        }

        // Step 5: Show success toast
        toast({
          title: 'Banner Image Updated',
          description: 'Your banner image has been updated successfully.',
          variant: 'default',
        });
      } catch (error) {
        console.error('Error during banner image upload: ', error);
        toast({
          title: 'Upload Failed',
          description: 'There was an error uploading your banner image. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-800">
        <Image
          src={bannerImage}
          alt="Banner"
          fill
          className="object-cover"
          unoptimized={true}
        />
        <label className="absolute right-4 top-4 cursor-pointer">
          {/* <div className="rounded-full bg-white/50 backdrop-blur-sm p-2 dark:bg-gray-900/50">
            <Camera className="h-6 w-6" />
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerImageChange}
            disabled={isLoading}  // Disable input while uploading
          /> */}
        </label>
      </div>
            {/* Profile Image */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-16">
        <div className="relative">
          <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden">
            {isLoading ? (
              <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700"></div>
            ) : (
              <Avatar className="w-32 h-32">
                <AvatarImage src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/` + profileImage} alt="Profile" />
                <AvatarFallback />
              </Avatar>
            )}
          </div>
          <label className="absolute right-0 bottom-0 cursor-pointer">
            {/* <div className="rounded-full bg-white dark:bg-gray-800 p-2 shadow-lg">
              <Camera className="h-5 w-5" />
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onProfileImageChange}
            /> */}
          </label>
        </div>
      </div>

    </div>
  );
};
