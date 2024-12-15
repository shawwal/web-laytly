'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import createUserEntry from '@/utils/createUserEntry';  // Import your utility to create user entry

const AuthCallbackPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Log the full URL to debug
      console.log('Current URL:', window.location.href);

      // Check if the URL has a hash fragment
      const hash = window.location.hash;
      if (!hash) {
        console.error('No hash found in the URL!');
        return;
      }

      // Parse the hash fragment into query parameters
      const params = new URLSearchParams(hash.replace('#', ''));

      // Log all parameters for debugging
      console.log('Parsed parameters:', Object.fromEntries(params.entries()));

      // Extract tokens from the URL hash fragment
      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const expires_at = params.get('expires_at');
      const expires_in = params.get('expires_in');
      const provider_token = params.get('provider_token');

      // Log the extracted values
      console.log('Access Token:', access_token);
      console.log('Refresh Token:', refresh_token);
      console.log('Expires At:', expires_at);
      console.log('Expires In:', expires_in);
      console.log('Provider Token:', provider_token);

      if (access_token && refresh_token) {
        try {
          // Attempt to set the session with Supabase
          const { error } = await supabase.auth.setSession({
            access_token: access_token as string,
            refresh_token: refresh_token as string,
          });

          // If there's an error with setting the session, log and alert the user
          if (error) {
            console.error('Error setting session:', error.message);
            alert('Error setting session.');
            return;
          }

          // If session is set successfully, log and proceed to create user entry
          console.log('Session successfully set!');

          // Create the user entry after the session is set
          const userEntry = await createUserEntry();
          console.log('User entry created:', userEntry);

          // Redirect to the dashboard or home page after creating the user entry
          router.push('/dashboard'); // Change '/dashboard' to your actual dashboard route
        } catch (error) {
          console.error('Error during callback:', error);
          alert('An error occurred during authentication.');
        }
      } else {
        console.error('Access or Refresh token is missing.');
        alert('Google Sign-In failed. Please try again.');
      }
    };

    handleAuth();
  }, [router]);

  return <div>Loading...</div>;
};

export default AuthCallbackPage;
