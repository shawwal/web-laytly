'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';  // Use the useAuth hook
import AuthForm from '@/components/AuthForm';

export default function SignUpPage() {

  const { loading, signUpWithEmail, loginWithGoogle } = useAuth();  // Destructure from useAuth
  const router = useRouter();

  // Handle sign-up form submission
  const handleSignUp = async (email: string, password: string) => {
    await signUpWithEmail(email, password);  // Call signUpWithEmail from the hook
    // Optionally redirect after successful sign-up (handled by toast message)
    router.push('/auth/login');
  };

  // Handle Google sign-up
  const handleGoogleSignUp = async () => {
    await loginWithGoogle();  // Call loginWithGoogle from the hook
    router.push('/auth/login');  // Optionally handle redirection after Google sign-up
  };

  return (
    <AuthForm
      title="Create an account"
      description="Enter your email below to create your account"
      buttonText="Sign Up"
      onSubmit={handleSignUp}
      loading={loading}
      googleLogin={handleGoogleSignUp}
      showGoogleButton={false}
      showLoginLink={true} // Show login link for sign-up
    />
  );
}
