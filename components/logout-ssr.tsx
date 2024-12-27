'use client'
import { useState } from 'react'
import LoadingOverlay from './loading-overlay'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)

    try {
      // Call the logout API route to delete cookies
      await fetch('/api/logout', { method: 'GET' });

      // Redirect the user to the login page (triggers a revalidation of the page)
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full p-2 bg-red-500 text-white rounded mt-10"
      >
        {loading ? 'Logging out...' : 'Log Out'}
      </button>

      {/* Loading Overlay */}
      {loading && (
        <LoadingOverlay />
      )}
    </>
  )
}
