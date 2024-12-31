'use client'

import { useEffect, useState } from 'react';
import { fetchUserProfile } from '@/utils/profile';  // The utility function to fetch profile
import { ProfileBanner } from '@/components/profile-banner';
import { ProfileInfo } from '@/components/profile-info';
import { ContactInfo } from '@/components/contact-info';
import { MediaTabs } from '@/components/media-tabs';
import { useParams } from 'next/navigation';
import LoadingOverlay from '@/components/loading-overlay';

export default function UserProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const { username } = useParams();
  const userId = username;  // Use the username from the URL

  useEffect(() => {
    // Fetch user profile when userId changes
    const fetchProfileData = async () => {
      if (userId) {
        const userProfile = await fetchUserProfile(userId as string);  // Fetch profile data based on userId
        setProfile(userProfile);
      }
    };

    fetchProfileData();
  }, [userId]);  // Re-run the effect when userId changes

  if (!profile) {
    return <LoadingOverlay />;  // Show loading state while fetching the profile
  }

  return (
    <div className="min-h-full bg-white dark:bg-gray-900">
      {/* Profile container with max width for desktop/tablet */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        {/* Banner and Profile Section */}
        <ProfileBanner />
        
        {/* Profile Info */}
        <div className="mt-6">
          <ProfileInfo name={profile.username || profile.email} avatarUrl={profile.avatar_url || '/default-avatar.png'} />
        </div>

        {/* Contact Info */}
        <div className="mt-6">
          <ContactInfo phone={profile.country_code + profile.phone_number} email={profile.email} />
        </div>

        {/* Media Tabs */}
        <div className="mt-8">
          <MediaTabs />
        </div>
      </div>
    </div>
  );
}
