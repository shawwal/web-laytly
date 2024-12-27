import React from 'react';
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your app settings',
}

export default async function Layout({ children }: { children: React.ReactNode }) {

  return (
    <div>
     {children}
    </div>
  );
}
