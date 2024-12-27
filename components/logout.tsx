'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import the useRouter hook for navigation
import { supabase } from '@/lib/supabase'; // Import your supabase client
import LoadingOverlay from './loading-overlay';

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize the useRouter hook for navigation

  const handleLogout = async () => {
    setLoading(true);

    try {
      // Perform the logout using Supabase's signOut method
      await supabase.auth.signOut();

      // Navigate to the login page
      router.push('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full p-2 bg-red-500 text-white rounded mt-10"
      >
        {loading ? 'Logging out...' : 'Log Out'}
      </button>

      {/* Loading Overlay */}
      {loading && <LoadingOverlay />}
    </>
  );
}
