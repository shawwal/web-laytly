'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // To handle redirects
import AuthForm from '@/components/AuthForm';
import LoadingOverlay from '@/components/loading-overlay';
import { useAuthentications } from '@/hooks/useAuthentications';
import useSession from '@/hooks/useSession'; // Assuming this hook provides session data

export default function LoginPage() {
  const { isSubmitting, handleLogin, handleGoogleLogin } = useAuthentications();
  const { session } = useSession(); // Get sessions from useSessions hook
  const router = useRouter();

  useEffect(() => {
    if (session) {
      // If sessions exist, redirect to '/'
      router.replace('/');
    }
  }, [session, router]);

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {isSubmitting && <LoadingOverlay />}

      <AuthForm
        title="Login"
        description="Enter your email below to login to your account"
        buttonText="Login"
        onSubmit={handleLogin}
        loading={isSubmitting}
        googleLogin={handleGoogleLogin}
        showGoogleButton={true}
        showLinks={true}
      />
    </div>
  );
}
