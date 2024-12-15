import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { AuthService } from '@/services/AuthService';
import createUserEntry from '@/utils/createUserEntry';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Sign-up with email
  const signUpWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Starting sign-up process with email:', email); // Log input
      await AuthService.signUpWithEmail(email, password);
      console.log('Sign-up successful'); // Log success
      toast({
        title: 'Success',
        description: 'Check your email for the confirmation link.',
      });
      // Optionally handle redirection or other post-signup behavior
    } catch (error: any) {
      console.error('Error during sign-up:', error); // Log error details
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Login with email
  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Logging in with email:', email); // Log input
      await AuthService.loginWithEmail(email, password);
      console.log('Login successful');
      // Log the result of createUserEntry
      const createUserResult = await createUserEntry();
      console.log('User entry created:', createUserResult);
    } catch (error: any) {
      console.error('Error during login:', error); // Log error details
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Google sign-in
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const user = await AuthService.loginWithGoogle();  // Assuming this handles the Google sign-in
      console.log("Google login successful, user:", user);
      // Make sure createUserEntry is called to ensure the user is created in the database
      const userEntry = await createUserEntry();  // Returns new or existing user data
      console.log('User entry created:', userEntry);
  
      // Handle successful Google login (e.g., redirect or other behavior)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, signUpWithEmail, loginWithEmail, loginWithGoogle };
};
