'use client';

import { useRouter } from 'next/navigation';

export default function AccessDeniedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-lg text-muted-foreground mb-4">
          You do not have permission to view this page. Please contact an administrator to gain access.
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/90 transition"
        >
          Back to Landing
        </button>
      </div>
    </div>
  );
}
