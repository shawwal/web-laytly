'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useProfile } from '@/hooks/useProfile'
import { ProfileHeader } from '@/components/profile-header'
import { ProfileFormFields } from '@/components/profile-form-fields'
import { DeleteAccountDialog } from '@/components/delete-account-dialog'
import LoadingOverlay from '@/components/loading-overlay'
import { useToast } from '@/components/ui/use-toast'  // Import the useToast hook
import checkUsernameExists from '@/utils/checkUsername'  // Import the function to check username availability
import { syncProfileWithSupabase } from '@/db/profile-sync'  // Assuming the function is in this path
import { Profile } from '@/models/profile'

export default function PersonalDataPage() {
  const { currentProfile, loading, handleUpdateProfile } = useProfile()
  const { toast } = useToast()  // Initialize toast function
  const [profileImage, setProfileImage] = useState('/placeholder.svg')
  const [bannerImage, setBannerImage] = useState('/abstract-bg.jpg')
  const [countryCode, setCountryCode] = useState('+60')
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isFormChanged, setIsFormChanged] = useState(false) // Track if form has been changed

  // console.log('currentProfile?.banner_url', currentProfile )
  const initialProfile = {
    full_name: currentProfile?.full_name || '',
    username: currentProfile?.username || '',
    email: currentProfile?.email || '',
    phone_number: currentProfile?.phone_number || '',
    avatar_url: currentProfile?.avatar_url || '/placeholder.svg',
    banner_url: currentProfile?.banner_url || '/abstract-bg.jpg)',
    country_code: currentProfile?.country_code || '+60'
  }

  // Populate the state with the current profile data initially
  useEffect(() => {
    if (currentProfile) {
      setFullName(currentProfile.full_name || '')
      setUsername(currentProfile.username || '')
      setEmail(currentProfile.email || '')
      setPhone(currentProfile.phone_number || '')
      setProfileImage(currentProfile.avatar_url || '/placeholder.svg')
      setBannerImage(currentProfile.banner_url || '/placeholder.svg?height=200&width=600')
      setCountryCode(currentProfile.country_code || '+60')
    }
  }, [currentProfile])

  // Track if the form values are different from the initial profile data
  useEffect(() => {
    // Compare current form state with the initial profile values to check if there's any change
    if (
      fullName !== initialProfile.full_name ||
      username !== initialProfile.username ||
      email !== initialProfile.email ||
      phone !== initialProfile.phone_number ||
      profileImage !== initialProfile.avatar_url ||
      bannerImage !== initialProfile.banner_url ||
      countryCode !== initialProfile.country_code
    ) {
      setIsFormChanged(true)
    } else {
      setIsFormChanged(false)
    }
  }, [fullName, username, email, phone, profileImage, bannerImage, countryCode, initialProfile.full_name, initialProfile.username, initialProfile.email, initialProfile.phone_number, initialProfile.avatar_url, initialProfile.banner_url, initialProfile.country_code])

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

  // console.log('currentProfile?.banner_url', currentProfile?.banner_url)

  const handleBannerImageUpdate = (newBannerUrl: string) => {
    setBannerImage(newBannerUrl);  // Update the state with the new banner image URL
  };

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

    // console.log('submitted current banner', currentProfile?.banner_url)

    const updatedProfile: Profile = {
      ...currentProfile,
      full_name: fullName,
      username,
      phone_number: phone,
      avatar_url: currentProfile?.avatar_url ?? '',
      banner_url: currentProfile?.banner_url ?? '',
      id: currentProfile?.id ?? '',
      email: currentProfile?.email ?? '',
      country_code: countryCode,  // Add country code to updated profile
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
        userId={currentProfile?.id || ''}
        profileImage={profileImage}
        bannerImage={bannerImage}
        currentBannerImage={bannerImage}
        onProfileImageChange={handleProfileImageChange}
        onBannerImageUpdate={handleBannerImageUpdate}
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
            disabled={!isFormChanged}  // Disable the button when no changes have been made
          >
            Save Changes
          </Button>
          <DeleteAccountDialog />
        </form>
      </div>
    </div>
  )
}
