// pages/auth/login.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const { loading, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      // Call the login API that includes revalidation
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (res.ok) {
        // Redirect user to the dashboard (or trigger revalidation in some other way)
        window.location.href = '/';
      } else {
        const data = await res.json();
        console.error(data.error);
        // Optionally handle error
      }
    } catch (error) {
      console.error("Login failed", error);
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
