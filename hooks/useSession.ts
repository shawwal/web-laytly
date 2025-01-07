import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Assuming this is your Supabase client
import { Session, User } from '@supabase/supabase-js';

interface SessionWithUser extends Session {
  user: User; // Make sure user is always included
}

const useSession = (): { session: Session | null; loading: boolean; setSession: React.Dispatch<React.SetStateAction<Session | null>> } => {
  const [session, setSession] = useState<SessionWithUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state to track session loading

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false); // Set loading to false once session is fetched
    };

    getSession(); // Get the session on mount

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading, setSession };
};

export default useSession;
