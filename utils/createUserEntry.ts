import { supabase } from '@/lib/supabase';

async function createUserEntry() {
  // Get the current user from the session
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  console.log('user test', user);

  if (userError) {
    console.error('Error retrieving user:', userError.message);
    return null;  // Return null if there was an error retrieving the user
  }

  if (!user) {
    console.log("No user is logged in");
    return null;  // Return null if there's no logged-in user
  }

  // Check if the user already exists in the `users` table
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id); // Match the user ID with the Supabase Auth ID

  if (error) {
    console.error('Error checking user existence:', error.message);
    return null;  // Return null if there was an error checking user existence
  }

  if (data && data.length > 1) {
    console.error('Multiple users found with the same ID');
    return null;  // Return null if multiple users are found
  }

  if (data && data.length === 0) {
    // User doesn't exist in the `users` table, create a new entry
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([{ id: user.id, role: 'user' }])
      .single(); // Single is safe here because we're only inserting one user

    if (createError) {
      console.error('Error creating new user:', createError.message);
      return null;  // Return null if the user creation fails
    }

    // Return the new user data after the insert
    return newUser;
  } else {
    // Return the existing user data if the user already exists
    return data[0];
  }
}

export default createUserEntry;
