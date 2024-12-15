// pages/auth/login.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const { loading, loginWithEmail, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      // Attempt login
      await loginWithEmail(email, password);
      // Redirect user to the dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error("Login failed", error);
      // Optional: show user-friendly error messages
    }
  };

  return (
    <AuthForm
      title="Login"
      description="Enter your email below to login to your account"
      buttonText="Login"
      onSubmit={handleLogin}
      loading={loading}
      googleLogin={loginWithGoogle}
      showGoogleButton={true}
      showLinks={true}
    />
  );
}
