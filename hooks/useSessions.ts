import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Assuming this is your Supabase client
import { Session } from '@supabase/supabase-js';

const useSession = (): { session: Session | null; loading: boolean } => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state to track session loading

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      // console.log('Session fetched on mount:', session); // Debugging
      setSession(session);
      setLoading(false); // Set loading to false once session is fetched
    };

    getSession(); // Get the session on mount

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // console.log('Session changed:', session); // Debugging
      setSession(session);
    });

    // Cleanup subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
};

export default useSession;
