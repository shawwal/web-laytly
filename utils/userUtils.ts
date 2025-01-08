// utils/userUtils.ts
import { supabase } from '@/lib/supabase';

/**
 * Update the display name of the user in Supabase.
 * @param newDisplayName - The new display name to set.
 * @returns A promise that resolves when the user data is updated or rejects with an error.
 */

interface UserProfile {
  id: string;
  role: string;
}

// Utility function to check if a UUID is valid
export const isValidUUID = (uuid: string) => {
  const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return regex.test(uuid);
};

export const updateDisplayName = async (newDisplayName: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: newDisplayName,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (error) {
    console.error('Error updating display name:', error);
    throw error;
  }
};

/**
 * Fetch the current user data from Supabase.
 * @returns The user data or null if there is an error.
 */
export const fetchUserDetails = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    return data?.user || null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    // Ensure the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error(authError?.message || 'User is not authenticated.');
    }

    // Fetch user data from the 'users' table using the user ID
    const { data, error } = await supabase
      .from('users')
      .select('id, role')  // Only fetching id and role
      .eq('id', user.id)    // Filter by authenticated user's ID
      .single();            // We expect a single row

    if (error) {
      throw new Error(error.message);
    }

    return data; // Return the user profile (id and role)
  } catch (error: any) {
    console.error('Error fetching user profile:', error.message);
    return null; // Return null in case of an error (e.g., user not found)
  }
};

export default fetchUserProfile;

