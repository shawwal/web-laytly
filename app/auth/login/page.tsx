'use client';
import { useState } from 'react'; // Importing useState
import { useRouter } from 'next/navigation'; // To handle redirects after login
import AuthForm from '@/components/AuthForm';
import LoadingOverlay from '@/components/loading-overlay';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter(); // For navigation after successful login
  const [isSubmitting, setIsSubmitting] = useState(false); // Track the submission state

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

      // Redirect to the dashboard after successful login
      // console.log('User logged in:', data);
      router.push('/'); // Redirect to the dashboard or home page
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

      // Redirect to the dashboard after successful login
      console.log('User logged in with Google:', data);
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
