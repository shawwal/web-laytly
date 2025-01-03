/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
'use client';
import { useState } from 'react'; // Importing useState
import { useRouter } from 'next/navigation'; // To handle redirects after login
import AuthForm from '@/components/AuthForm';
import LoadingOverlay from '@/components/loading-overlay';
import { supabase } from '@/lib/supabase';
import db from '@/db/dexie-db';

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsSubmitting(true); // Set submitting to true when login starts
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error(error.message); // Log any error
        alert(error.message); // Optionally show the error
        return;
      }

      // Successful Login: Open Dexie database and then redirect
      await db.open(); // Open the Dexie database
      console.log('User logged in and Dexie database opened successfully.');

      router.replace('/'); // Redirect to the dashboard or home page
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setIsSubmitting(false); // Reset submitting state once request is done
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true); // Set submitting to true when login starts
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google', // OAuth provider (Google)
      });

      if (error) {
        console.error(error.message); // Log any error
        alert(error.message); // Optionally show the error
        return;
      }

      // Successful Login with Google: Open Dexie database and then redirect
      await db.open(); // Open the Dexie database
      console.log('User logged in with Google and Dexie database opened successfully.');

      router.push('/'); // Redirect to the dashboard or home page
    } catch (error) {
      console.error('Google login failed', error);
    } finally {
      setIsSubmitting(false); // Reset submitting state once request is done
    }
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isSubmitting && <LoadingOverlay />}

      <AuthForm
        title="Login"
        description="Enter your email below to login to your account"
        buttonText="Login"
        onSubmit={handleLogin}
        loading={isSubmitting}
        googleLogin={handleGoogleLogin} // Use the Google login handler here
        showGoogleButton={true} // Show the Google login button
        showLinks={true}
      />
    </div>
  );
}