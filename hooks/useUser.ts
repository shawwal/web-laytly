import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useUser = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          setError(error.message);
          return;
        }
        setUser(data);
      } catch (error) {
        setError('Error fetching user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading, error };
};
