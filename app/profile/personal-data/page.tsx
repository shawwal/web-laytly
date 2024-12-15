'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Camera, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// Country codes data
const countryCodes = [
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  // Add more country codes as needed
]

export default function PersonalDataPage() {
  const [profileImage, setProfileImage] = useState('/placeholder.svg')
  const [bannerImage, setBannerImage] = useState('/placeholder.svg?height=200&width=600')
  const [countryCode, setCountryCode] = useState('+62')

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

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="mb-16 sm:mb-0">
        <div className="relative">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 z-10 bg-white/50 backdrop-blur-sm dark:bg-gray-900/50"
            asChild
          >
            <Link href="/profile">
              <ChevronLeft className="h-6 w-6" />
            </Link>
          </Button>

          {/* Banner Image */}
          <div className="relative h-48 bg-gray-200 dark:bg-gray-800">
            <Image
              src={bannerImage}
              alt="Banner"
              fill
              className="object-cover"
            />
            <label className="absolute right-4 top-4 cursor-pointer">
              <div className="rounded-full bg-white/50 backdrop-blur-sm p-2 dark:bg-gray-900/50">
                <Camera className="h-6 w-6" />
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerImageChange}
              />
            </label>
          </div>

          {/* Profile Image */}
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-16">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden">
                <Image
                  src={profileImage}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <label className="absolute right-0 bottom-0 cursor-pointer">
                <div className="rounded-full bg-white dark:bg-gray-800 p-2 shadow-lg">
                  <Camera className="h-5 w-5" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto px-4 pt-24 pb-8">
          <h1 className="text-2xl font-bold mb-8">Personal Data</h1>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Enter your full name"
                defaultValue="Lidia Terecia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                defaultValue="lidiaterecia"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="email">Email</Label>
                <Button variant="link" className="text-blue-500 h-auto p-0">
                  Change
                </Button>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                defaultValue="lidiaterecia@gmail.com"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If you change it, you must re-verify
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="phone">Phone Number</Label>
                <Button variant="link" className="text-blue-500 h-auto p-0">
                  Change
                </Button>
              </div>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="mr-2">{country.flag}</span>
                        {country.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  defaultValue="81234567890"
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If you change it, you must re-verify
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#5BA4A4] hover:bg-[#4A8F8F] text-white"
            >
              Save Changes
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </div>
      </div>
    </div>
  )
}

