// /utils/supabase/profile.ts
import { supabase } from '@/lib/supabase';
import { Profile } from '@/models/profile';

// Fetch profile from Supabase by userId
export const fetchProfileFromSupabase = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error('Failed to fetch profile from Supabase: ' + error.message);
  }

  return data as Profile;
};

// Update profile in Supabase
export const updateProfileInSupabase = async (profile: Profile): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .eq('id', profile.id);

  if (error) {
    throw new Error('Failed to update profile in Supabase: ' + error.message);
  }

  return data as unknown as Profile;
};
