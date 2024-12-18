import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase'; // Assuming this is your Supabase client
import { Session } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const useSession = (): Session | null => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return session;
};

export default useSession;
