'use client'

import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const languages = [
  { code: 'en-US', name: 'English (USA)', flag: '🇺🇸' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
]

export default function LanguagePage() {
  const [search, setSearch] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en-US')

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center gap-4 p-4 border-b bg-white dark:bg-gray-800">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-lg font-semibold">Language</h1>
      </div>

      <div className="p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white dark:bg-gray-800"
          />

          <div className="space-y-2">
            {filteredLanguages.map((language) => (
              <button
                key={language.code}
                className={cn(
                  "w-full p-4 flex items-center gap-4 rounded-lg text-left",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "transition-colors duration-200",
                  selectedLanguage === language.code && "bg-gray-100 dark:bg-gray-800"
                )}
                onClick={() => setSelectedLanguage(language.code)}
              >
                <span className="text-2xl">{language.flag}</span>
                <span className="font-medium">{language.name}</span>
              </button>
            ))}
          </div>

          <Button 
            className="w-full bg-[#5BA4A4] hover:bg-[#4A8F8F]"
            onClick={() => {
              // Handle language change
              window.location.href = '/settings'
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  )
}

