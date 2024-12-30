// /db/profile-sync.ts
import { Profile } from '@/db/dexie-db';
import { fetchProfileFromSupabase, updateProfileInSupabase } from '@/utils/supabase/profile';
import db from '@/db/dexie-db';

// Sync profile from Supabase to local Dexie database
// Sync profile from Supabase to local Dexie database
export const syncProfileWithSupabase = async (userId: string): Promise<boolean> => {
  try {
    const profileFromSupabase = await fetchProfileFromSupabase(userId);
    
    // Simulate storing the profile locally in Dexie DB
    await db.profiles.put(profileFromSupabase);  // Assuming you are using Dexie to store this locally
    
    return true;  // Indicate success
  } catch (error) {
    console.error('Error syncing updated profile to Supabase:', error);

    // Return false to indicate failure
    return false;
  }
};
// Sync updated profile from local Dexie DB to Supabase
export const syncUpdatedProfileToSupabase = async (profile: Profile) => {
  try {
    await updateProfileInSupabase(profile); // Sync to Supabase
    await db.profiles.put(profile); // Store the updated profile locally
  } catch (error) {
    console.error('Error syncing updated profile to Supabase:', error);
  }
};
