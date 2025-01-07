// hooks/useAuth.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import db from '@/db/dexie-db';

export function useAuthentications() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw new Error(error.message);
      }

      await db.open(); // Open Dexie database
      router.replace('/'); // Redirect after successful login
    } catch (error) {
      alert(error); // Show error to user
      console.error('Login failed', error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        throw new Error(error.message);
      }

      await db.open(); // Open Dexie database
      router.push('/'); // Redirect after successful Google login
    } catch (error) {
      alert(error); // Show error to user
      console.error('Google login failed', error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return { isSubmitting, handleLogin, handleGoogleLogin };
}
