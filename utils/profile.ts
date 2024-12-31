import { supabase } from '@/lib/supabase';

export async function fetchUserProfile(userId: string) {
  console.log('fetching profile for userId:', userId);

  try {
    // Fetch the user profile from Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();  // Expecting a single row

    if (error) {
      // Handle if there's an error during fetching
      console.error('Error fetching profile:', error.message);
      throw error;
    }

    if (!data) {
      // Handle if no data is returned for the userId
      console.warn('No profile found for userId:', userId);
      return null;  // Return null or you can return a default object
    }

    return data;  // Return the fetched profile data

  } catch (error) {
    // Catch any unexpected errors and log them
    console.error('Unexpected error while fetching profile:', error);
    throw new Error('Unable to fetch profile');
  }
}
