import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Make sure the path is correct

interface AuthContextType {
  user: any; // You can make this more specific based on your user data
  role: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
  loginWithEmail: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Fetch user and role from Supabase on initial load
  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  // Redirect to login or access denied page if not authenticated or authorized
  useEffect(() => {
    if (loading) return; // Wait for the auth context to load

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/auth/login');
    } else if (isAuthenticated && role !== 'admin' && window.location.pathname.startsWith('/')) {
      // Redirect to access denied if user is not an admin and is trying to access the dashboard
      router.push('/access-denied');
    }
  }, [isAuthenticated, role, loading, router]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  const loginWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error(error.message);
    } else {
      setUser(data.user);
      const { data: profileData } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();
      setRole(profileData?.role || null);
      setIsAuthenticated(true);
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, loading, logout, loginWithEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
