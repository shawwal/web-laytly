'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabase' // Assuming you have a Supabase client in this location

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)

    try {
      await supabase.auth.signOut() // Sign out the user from Supabase
      router.push('/auth/login')    // Redirect to login page after successful logout
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full p-2 bg-red-600 text-white rounded"
    >
      {loading ? 'Logging out...' : 'Log Out'}
    </button>
  )
}
