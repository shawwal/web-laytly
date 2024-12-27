'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useProfile } from '@/hooks/useProfile'
import { ProfileHeader } from '@/components/profile-header'
import { ProfileFormFields } from '@/components/profile-form-fields'
import { DeleteAccountDialog } from '@/components/delete-account-dialog'
import LoadingOverlay from '@/components/loading-overlay'

export default function PersonalDataPage() {
  const { currentProfile, loading, handleUpdateProfile } = useProfile()
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
      setUsername(currentProfile.username)
      setEmail(currentProfile.email)
      setPhone(currentProfile.phone_number)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedProfile = { ...currentProfile, full_name: fullName, username, phone_number: phone }
    handleUpdateProfile(updatedProfile)
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
