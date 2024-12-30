import { useState, useEffect } from 'react';
import { useProfiles, useUpdateProfile } from '@/db/dexie-hooks';
import { syncProfileWithSupabase, syncUpdatedProfileToSupabase } from '@/db/profile-sync';
import { isProfileChanged } from '@/utils/profile-utils';
import useSession from '@/hooks/useSession';
import { Profile } from '@/models/profile';

export const useProfile = () => {
  const { session, loading: sessionLoading } = useSession(); // Assuming useSession returns session object
  const { profiles, loading: profileLoading } = useProfiles();
  const updateProfile = useUpdateProfile();
  const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);
  useEffect(() => {
    if (sessionLoading || profileLoading) return; // Don't run logic if data is still loading

    if (session?.user?.id) {
      // Find the profile for the logged-in user
      const userProfile = profiles.find((profile) => profile.id === session.user.id);

      // Set current profile to the found profile or null
      setCurrentProfile(userProfile || null);

      // If no profile exists locally, sync it from Supabase
      if (!userProfile) {
        syncProfileWithSupabase(session.user.id);
      }
    }
  }, [session, profiles, sessionLoading, profileLoading]); // Re-run whenever session or profiles change

  const handleUpdateProfile = async (updatedProfile: Profile) => {
    if (currentProfile && isProfileChanged(currentProfile, updatedProfile)) {
      try {
        // Update local DB
        await updateProfile(updatedProfile);

        // Sync updated profile with Supabase
        await syncUpdatedProfileToSupabase(updatedProfile);

        // Update local state with the latest profile
        setCurrentProfile(updatedProfile);
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  return {
    currentProfile,
    loading: sessionLoading || profileLoading,
    handleUpdateProfile,
  };
};
