'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import the useRouter hook for navigation
import { supabase } from '@/lib/supabase'; // Import your supabase client
import LoadingOverlay from '@/components/loading-overlay';
import db from '@/db/dexie-db'; // Import the Dexie DB instance
import useSession from '@/hooks/useSession'; // Assuming this hook is being used to manage session

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Track logout error state
  const router = useRouter(); // Initialize the useRouter hook for navigation
  const { loading: sessionLoading, setSession } = useSession(); // Get current session state

  const handleLogout = async () => {
    setLoading(true);
    setError(null); // Reset error state before starting the logout process

    try {
      // Clear all tables in Dexie DB using the utility function
      await db.clearAllData(); // Clear and recreate tables before logging out

      // Perform the logout using Supabase's signOut method
      const { error } = await supabase.auth.signOut()
      if(error) {
        console.log('error signout', error)
      }
      // Manually clear the session state immediately after signOut
      setSession(null); // Set the session to null to reflect the logout immediately
      // Navigate to the login page
      router.replace('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
      setError('Something went wrong while logging you out. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={loading || sessionLoading} // Disable button if loading or session is still loading
        className="w-full p-2 bg-red-500 text-white rounded mt-10"
      >
        {loading ? 'Logging out...' : 'Log Out'}
      </button>

      {/* Show error message if something goes wrong */}
      {error && (
        <div className="mt-4 p-2 bg-red-500 text-white rounded">
          {error}
        </div>
      )}

      {/* Loading Overlay */}
      {loading && <LoadingOverlay />}
    </div>
  );
}
