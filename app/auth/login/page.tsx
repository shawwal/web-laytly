'use client';
import { useState } from 'react'; // Importing useState
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';
import LoadingOverlay from '@/components/loading-overlay';

export default function LoginPage() {
  const { loading, loginWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false); // Track the submission state

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsSubmitting(true); // Set submitting to true when login starts
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
    } finally {
      setIsSubmitting(false); // Reset submitting state once request is done
    }
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {(loading || isSubmitting) && (
        <LoadingOverlay />
      )}

      <AuthForm
        title="Login"
        description="Enter your email below to login to your account"
        buttonText="Login"
        onSubmit={handleLogin}
        loading={loading}
        googleLogin={loginWithGoogle}
        showGoogleButton={false}
        showLinks={true}
      />
    </div>
  );
}
