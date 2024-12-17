'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { login } from '@/app/auth/actions'; // Import server action

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle form submission
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    try {
      // Call the server action to handle login
      await login(formData); // server-side action for login
      router.push('/chat'); // Redirect to the chat page after successful login
    } catch (error) {
      setError('Login failed, please try again');
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <AuthForm
        title="Login"
        description="Enter your email below to login to your account"
        buttonText="Login"
        onSubmit={handleLogin} // Pass the login handler to the form
        loading={loading}
        showGoogleButton={true}
        showLinks={true}
      />
    </div>
  );
}
