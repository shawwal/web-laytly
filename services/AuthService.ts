import { supabase } from '@/lib/supabase';

// AuthService encapsulates all authentication logic
export const AuthService = {
  // Login with email and password
  loginWithEmail: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error; // Throw error if login fails
      return data.user; // Access the user from the `data` object
    } catch (error) {
      throw error; // Pass the error up the chain
    }
  },

  // Sign up with email and password
  signUpWithEmail: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error; // Throw error if sign-up fails
      return data.user; // Access the user from the `data` object
    } catch (error) {
      throw error; // Pass the error up the chain
    }
  },

  // Login with Google OAuth
  loginWithGoogle: async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error; // Throw error if Google login fails
      return data; // Access the user from the `data` object
    } catch (error) {
      throw error; // Pass the error up the chain
    }
  }
};
