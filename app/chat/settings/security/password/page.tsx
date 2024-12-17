'use client'

import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password change
  }

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4 p-4 border-b bg-white dark:bg-gray-800">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings/security">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">Create New Password</h1>
      </div>

      <div className="p-4 max-w-md mx-auto">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Your new password must be different from previous used password
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
              className="bg-white dark:bg-gray-800"
            />
            <p className="text-xs text-gray-500">
              Use 8 or more characters with a mix of letters, numbers, and symbols.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="bg-white dark:bg-gray-800"
            />
            <p className="text-xs text-gray-500">Both password must match</p>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#5BA4A4] hover:bg-[#4A8F8F]"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  )
}

