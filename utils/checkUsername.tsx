import { supabase } from '@/lib/supabase'; // Import Supabase client

// Check if the username exists in Supabase
async function checkUsernameExists(username: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username);

    if (error) {
      console.error('Error checking username:', error.message);
      return 'Unable to check username availability'; // Return error message if Supabase fails
    }

    return data.length > 0 ? 'Username is already taken' : null; // Return a message if username exists
  } catch (error) {
    console.error('Unexpected error:', error);
    return 'An unexpected error occurred'; // Return a generic error message in case of an unexpected error
  }
}

export default checkUsernameExists;
