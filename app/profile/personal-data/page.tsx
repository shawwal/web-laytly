'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useProfile } from '@/hooks/useProfile'
import { ProfileHeader } from '@/components/profile-header'
import { ProfileFormFields } from '@/components/profile-form-fields'
import { DeleteAccountDialog } from '@/components/delete-account-dialog'
import LoadingOverlay from '@/components/loading-overlay'
import { Profile } from '@/db/dexie-db'
import { useToast } from '@/components/ui/use-toast'  // Import the useToast hook
import checkUsernameExists from '@/utils/checkUsername'  // Import the function to check username availability
import { syncProfileWithSupabase } from '@/db/profile-sync'  // Assuming the function is in this path

export default function PersonalDataPage() {
  const { currentProfile, loading, handleUpdateProfile } = useProfile()
  const { toast } = useToast()  // Initialize toast function
  const [profileImage, setProfileImage] = useState('/placeholder.svg')
  const [bannerImage, setBannerImage] = useState('/placeholder.svg?height=200&width=600')
  const [countryCode, setCountryCode] = useState('+60')
  const [fullName, setFullName] = useState(currentProfile?.full_name || '')
  const [username, setUsername] = useState(currentProfile?.username || '')
  const [email, setEmail] = useState(currentProfile?.email || '')
  const [phone, setPhone] = useState(currentProfile?.phone_number || '')

  useEffect(() => {
    if (currentProfile) {
      setFullName(currentProfile.full_name || '')
      setUsername(currentProfile.username || '')
      setEmail(currentProfile.email)
      setPhone(currentProfile.phone_number || '')
      setProfileImage(currentProfile.avatar_url || '/placeholder.svg')
      setBannerImage(currentProfile.banner_url || '/placeholder.svg?height=200&width=600')
    }
  }, [currentProfile])

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    // Check if the username has changed
    if (username !== currentProfile?.username) {
      const usernameError = await checkUsernameExists(username)
  
      if (usernameError) {
        // If username already exists or there was an error, show the error toast and stop further execution
        toast({
          title: 'Username Error',
          description: usernameError,
          variant: 'destructive',
        })
        return
      }
    }
  
    const updatedProfile: Profile = {
      ...currentProfile,
      full_name: fullName,
      username,
      phone_number: phone,
      avatar_url: currentProfile?.avatar_url ?? '',
      banner_url: currentProfile?.banner_url ?? '',
      expo_push_token: currentProfile?.expo_push_token || '',
      storage_used: currentProfile?.storage_used || 0,
      website: currentProfile?.website || '',
      id: currentProfile?.id ?? '',
      email: currentProfile?.email ?? ''
    }
  
    try {
      // Call the function to sync the profile to Supabase
      const syncSuccess = await syncProfileWithSupabase(updatedProfile.id)
  
      if (!syncSuccess) {
        // Show error toast if sync fails (e.g., due to some issue in the syncing process)
        toast({
          title: 'Sync Failed',
          description: 'There was an issue syncing your profile with Supabase. Please try again.',
          variant: 'destructive',
        })
        return;  // Don't proceed if sync failed
      }
  
      // Proceed with updating the profile locally if sync is successful
      await handleUpdateProfile(updatedProfile)
  
      // Show success toast notification only if the sync and update were successful
      toast({
        title: 'Profile Updated',
        description: 'Your personal data has been successfully updated.',
        variant: 'default',
      })
    } catch (error: any) {
      // Catch any errors that occurred during the process
      toast({
        title: 'Update Failed',
        description: error.message || 'There was an issue updating your profile. Please try again later.',
        variant: 'destructive',
      })
    }
  }
  

  if (loading) {
    return <LoadingOverlay />
  }

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <ProfileHeader
        profileImage={profileImage}
        bannerImage={bannerImage}
        onProfileImageChange={handleProfileImageChange}
        onBannerImageChange={handleBannerImageChange}
        isLoading={loading}
      />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-8">
        <h1 className="text-2xl font-bold mb-8">Personal Data</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <ProfileFormFields
            fullName={fullName}
            username={username}
            email={email}
            phone={phone}
            countryCode={countryCode}
            setFullName={setFullName}
            setUsername={setUsername}
            setEmail={setEmail}
            setPhone={setPhone}
            setCountryCode={setCountryCode}
          />
          <Button
            type="submit"
            className="w-full bg-[#5BA4A4] hover:bg-[#4A8F8F] text-white"
          >
            Save Changes
          </Button>
          <DeleteAccountDialog />
        </form>
      </div>
    </div>
  )
}
