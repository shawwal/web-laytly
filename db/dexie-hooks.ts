// /db/dexie-hooks.ts
import { useState, useEffect } from 'react';
import db, { Profile } from '@/db/dexie-db';

// Hook to fetch profiles from the local Dexie database
export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const profilesFromDb = await db.profiles.toArray();
      setProfiles(profilesFromDb);
      setLoading(false);
    };

    fetchProfiles();
  }, []);

  return { profiles, loading };
};

// Hook to update a profile in the local Dexie database
export const useUpdateProfile = () => {
  const updateProfile = async (updatedProfile: Profile) => {
    try {
      await db.profiles.put(updatedProfile);
    } catch (error) {
      console.error('Error updating profile in local DB:', error);
    }
  };

  return updateProfile;
};
