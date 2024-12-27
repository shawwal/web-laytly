import { Camera } from 'lucide-react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface ProfileHeaderProps {
  profileImage: string
  bannerImage: string
  onProfileImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBannerImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  isLoading: boolean
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileImage,
  bannerImage,
  onProfileImageChange,
  onBannerImageChange,
  isLoading,
}) => {
  return (
    <div className="relative">
      {/* Banner Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-800">
        <Image
          src={bannerImage}
          alt="Banner"
          fill
          className="object-cover"
        />
        <label className="absolute right-4 top-4 cursor-pointer">
          <div className="rounded-full bg-white/50 backdrop-blur-sm p-2 dark:bg-gray-900/50">
            <Camera className="h-6 w-6" />
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onBannerImageChange}
          />
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
                <AvatarImage src={profileImage} alt="Profile" />
                <AvatarFallback />
              </Avatar>
            )}
          </div>
          <label className="absolute right-0 bottom-0 cursor-pointer">
            <div className="rounded-full bg-white dark:bg-gray-800 p-2 shadow-lg">
              <Camera className="h-5 w-5" />
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onProfileImageChange}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
